#!/usr/bin/env python3

import argparse
import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

SCHEMA_HEADERS = [
    "LetterboxdURI",
    "tmdbID",
    "imdbID",
    "Title",
    "Year",
    "Directors",
    "WatchedDate",
    "Rating",
    "Rating10",
    "Tags",
    "Review",
]

DEFAULT_ROW: Dict[str, Any] = {
    "LetterboxdURI": None,
    "tmdbID": None,
    "imdbID": None,
    "Title": "",
    "Year": None,
    "Directors": None,
    "WatchedDate": None,
    "Rating": None,
    "Rating10": None,
    "Tags": None,
    "Review": None,
}


def read_json(file_path: Path) -> Any:
    return json.loads(file_path.read_text(encoding="utf-8"))


def build_rating_map(ratings: Iterable[Dict[str, Any]]) -> Dict[int, int]:
    rating_map: Dict[int, int] = {}
    for entry in ratings:
        movie = entry.get("movie") or {}
        ids = movie.get("ids") or {}
        trakt_id = ids.get("trakt")
        rating = entry.get("rating")
        if isinstance(trakt_id, int) and isinstance(rating, int):
            rating_map[trakt_id] = rating
    return rating_map


def format_watched_date(date_value: Optional[str]) -> Optional[str]:
    if not date_value:
        return None
    try:
        parsed = datetime.fromisoformat(date_value.replace("Z", "+00:00"))
        return parsed.strftime("%Y-%m-%d")
    except ValueError:
        return None


def map_to_letterboxd(
    item: Dict[str, Any], rating: Optional[int], is_watchlist: bool
) -> Dict[str, Any]:
    movie = item.get("movie") or {}
    ids = movie.get("ids") or {}

    row = dict(DEFAULT_ROW)
    row["tmdbID"] = ids.get("tmdb")
    row["imdbID"] = ids.get("imdb")
    row["Title"] = movie.get("title") or ""
    row["Year"] = movie.get("year")
    row["Rating10"] = rating if isinstance(rating, int) else None
    row["WatchedDate"] = None if is_watchlist else format_watched_date(
        item.get("last_watched_at")
    )
    return row


def write_csv(rows: List[Dict[str, Any]], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=SCHEMA_HEADERS)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Export Trakt JSON to Letterboxd CSV."
    )
    parser.add_argument("--watched", required=True, help="Path to watched-movies.json")
    parser.add_argument("--ratings", help="Path to ratings-movies.json")
    parser.add_argument("--out", default="history.csv", help="Output CSV name")
    parser.add_argument("--watchlist", help="Path to watchlist-movies.json")
    parser.add_argument(
        "--watchlist-out", default="watchlist.csv", help="Watchlist output CSV name"
    )
    args = parser.parse_args()

    watched_path = Path(args.watched)
    ratings_path = Path(args.ratings) if args.ratings else None
    out_path = Path(args.out)

    watched = read_json(watched_path)
    ratings = read_json(ratings_path) if ratings_path else []
    rating_map = build_rating_map(ratings)

    history_rows = [
        map_to_letterboxd(item, rating_map.get(item.get("movie", {}).get("ids", {}).get("trakt")), False)
        for item in watched
    ]
    write_csv(history_rows, out_path)
    print(f"Wrote history csv: {out_path.resolve()}")

    if args.watchlist:
        watchlist_path = Path(args.watchlist)
        watchlist_out_path = Path(args.watchlist_out)
        watchlist = read_json(watchlist_path)
        watchlist_rows = [map_to_letterboxd(item, None, True) for item in watchlist]
        write_csv(watchlist_rows, watchlist_out_path)
        print(f"Wrote watchlist csv: {watchlist_out_path.resolve()}")


if __name__ == "__main__":
    main()
