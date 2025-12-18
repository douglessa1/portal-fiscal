
exports.up = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.string('subscription_tier').defaultTo('free'); // free, pro, enterprise
        table.timestamp('subscription_ends_at').nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.dropColumn('subscription_tier');
        table.dropColumn('subscription_ends_at');
    });
};
