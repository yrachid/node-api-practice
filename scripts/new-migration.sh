#!/bin/bash

readonly MIGRATIONS_PATH="${MIGRATIONS_PATH:-${PWD}/app/src/migrations}"
readonly FILENAME="$(date +%Y%m%d%H%M%S)_${MIGRATION_NAME:-''}.ts"

readonly FULL_PATH="${MIGRATIONS_PATH}/${FILENAME}"


echo '
import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
}

export async function down(db: Kysely<unknown>): Promise<void> {
}' >> "${FULL_PATH}"

echo "Migration Created:"
echo
echo "${FULL_PATH}"
echo
