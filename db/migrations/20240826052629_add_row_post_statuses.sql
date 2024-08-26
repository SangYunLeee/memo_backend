-- migrate:up
UPDATE posts SET status_id = 1 WHERE status_id = 2;
INSERT INTO post_statuses (id, status_name) VALUES (3, 'Unregistered')
-- migrate:down
DELETE FROM post_statuses WHERE id = 3;
