-- migrate:up
ALTER TABLE post_images
  DROP CONSTRAINT post_images_post_id_fkey,
  ALTER COLUMN post_id DROP NOT NULL;

ALTER TABLE post_images
  ADD CONSTRAINT post_images_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE post_images
  DROP CONSTRAINT post_images_post_id_fkey,
  ALTER COLUMN post_id SET NOT NULL;

ALTER TABLE post_images
  ADD CONSTRAINT post_images_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts(id);
