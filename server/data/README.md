# WhiskeyProject test data

These JSON files are a local snapshot of
[`fixtures/whiskey_data.json`](https://github.com/WhiskeyProject/whiskey-api/blob/master/fixtures/whiskey_data.json).
It is used only for testing. The source repository does not state a reuse license;
do not ship this data in a public app without confirming permission.

`whiskies.json` contains 500 whiskies with tag IDs directly embedded as
`tags: [12, 15]`. `tags.json` contains the 67 tag definitions.
The original 5,854 `tagtracker` rows were folded into `whiskies.json`;
their primary keys and `count` values were not needed. All `fields` properties were flattened to
the same level as `pk`, and `model` was removed because each file has one record type.
`price` and `created_at` were removed. `comparable` references other whisky IDs.
The original `tagsearch` records were omitted because the app does not use saved searches.
The separate `whiskey_data2.json` is not included because its 393 whisky records
are already present in this snapshot.

Bottle image URLs still point to external sites and are not stored locally.
