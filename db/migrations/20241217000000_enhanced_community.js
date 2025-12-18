/**
 * Enhanced Community Forum Schema
 * Adds voting, bookmarks, tags, notifications, and badges
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        // Post Votes (upvotes/downvotes)
        .createTable('post_votes', function (table) {
            table.increments('id').primary();
            table.integer('post_id').unsigned().notNullable()
                .references('id').inTable('posts').onDelete('CASCADE');
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.enum('vote_type', ['up', 'down']).notNullable();
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.unique(['post_id', 'user_id']);
            table.index(['post_id']);
            table.index(['user_id']);
        })

        // Comment Votes
        .createTable('comment_votes', function (table) {
            table.increments('id').primary();
            table.integer('comment_id').unsigned().notNullable()
                .references('id').inTable('comments').onDelete('CASCADE');
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.enum('vote_type', ['up', 'down']).notNullable();
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.unique(['comment_id', 'user_id']);
            table.index(['comment_id']);
            table.index(['user_id']);
        })

        // Tags
        .createTable('tags', function (table) {
            table.increments('id').primary();
            table.string('name', 50).notNullable().unique();
            table.string('slug', 50).notNullable().unique();
            table.string('color', 7).defaultTo('#3b82f6'); // Default blue
            table.text('description');
            table.integer('post_count').defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.index(['slug']);
        })

        // Post-Tag relationship (many-to-many)
        .createTable('post_tags', function (table) {
            table.integer('post_id').unsigned().notNullable()
                .references('id').inTable('posts').onDelete('CASCADE');
            table.integer('tag_id').unsigned().notNullable()
                .references('id').inTable('tags').onDelete('CASCADE');
            table.primary(['post_id', 'tag_id']);
            table.index(['post_id']);
            table.index(['tag_id']);
        })

        // Bookmarks
        .createTable('bookmarks', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.integer('post_id').unsigned().notNullable()
                .references('id').inTable('posts').onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.unique(['user_id', 'post_id']);
            table.index(['user_id']);
            table.index(['post_id']);
        })

        // Notifications
        .createTable('notifications', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.enum('type', ['comment', 'mention', 'vote', 'answer_accepted', 'badge']).notNullable();
            table.integer('reference_id'); // ID do post, comment, etc
            table.text('message').notNullable();
            table.boolean('read').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.index(['user_id', 'read']);
            table.index(['created_at']);
        })

        // Badges (conquistas)
        .createTable('badges', function (table) {
            table.increments('id').primary();
            table.string('name', 50).notNullable().unique();
            table.text('description');
            table.string('icon', 50); // emoji ou nome do ícone
            table.string('color', 7).defaultTo('#fbbf24'); // Default gold
            table.integer('requirement'); // threshold para ganhar
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })

        // User-Badge relationship (conquistas ganhas)
        .createTable('user_badges', function (table) {
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.integer('badge_id').unsigned().notNullable()
                .references('id').inTable('badges').onDelete('CASCADE');
            table.timestamp('earned_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.primary(['user_id', 'badge_id']);
            table.index(['user_id']);
        })

        // Enhance Posts table
        .table('posts', function (table) {
            table.integer('upvotes').defaultTo(0);
            table.integer('downvotes').defaultTo(0);
            table.integer('best_answer_id').unsigned()
                .references('id').inTable('comments').onDelete('SET NULL');
            table.boolean('pinned').defaultTo(false);
            table.boolean('locked').defaultTo(false);
            table.timestamp('updated_at');
            table.index(['category']);
            table.index(['pinned', 'created_at']);
            table.index(['is_solved']);
        })

        // Enhance Comments table
        .table('comments', function (table) {
            table.integer('upvotes').defaultTo(0);
            table.integer('downvotes').defaultTo(0);
            table.integer('parent_id').unsigned()
                .references('id').inTable('comments').onDelete('CASCADE');
            table.timestamp('updated_at');
            table.index(['post_id', 'parent_id']);
        })

        // Enhance Users table
        .table('users', function (table) {
            table.string('avatar_url');
            table.text('bio');
            table.string('location', 100);
            table.string('website');
            table.integer('badges_count').defaultTo(0);
            table.integer('posts_count').defaultTo(0);
            table.integer('comments_count').defaultTo(0);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        // Remove new columns from existing tables
        .table('users', function (table) {
            table.dropColumn('avatar_url');
            table.dropColumn('bio');
            table.dropColumn('location');
            table.dropColumn('website');
            table.dropColumn('badges_count');
            table.dropColumn('posts_count');
            table.dropColumn('comments_count');
        })
        .table('comments', function (table) {
            table.dropColumn('upvotes');
            table.dropColumn('downvotes');
            table.dropColumn('parent_id');
            table.dropColumn('updated_at');
        })
        .table('posts', function (table) {
            table.dropColumn('upvotes');
            table.dropColumn('downvotes');
            table.dropColumn('best_answer_id');
            table.dropColumn('pinned');
            table.dropColumn('locked');
            table.dropColumn('updated_at');
        })
        // Drop new tables
        .dropTableIfExists('user_badges')
        .dropTableIfExists('badges')
        .dropTableIfExists('notifications')
        .dropTableIfExists('bookmarks')
        .dropTableIfExists('post_tags')
        .dropTableIfExists('tags')
        .dropTableIfExists('comment_votes')
        .dropTableIfExists('post_votes');
};
