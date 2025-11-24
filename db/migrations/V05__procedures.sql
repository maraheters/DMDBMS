-- Удаление старых логов
CREATE OR REPLACE PROCEDURE purge_old_logs(
    p_days_retention INT,
    p_batch_size INT DEFAULT 1000
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    LOOP
        DELETE FROM USER_ACTIVITY
        WHERE id IN (
            SELECT id 
            FROM USER_ACTIVITY 
            WHERE timestamp < NOW() - (p_days_retention || ' days')::INTERVAL
            LIMIT p_batch_size
        );

        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

        EXIT WHEN v_deleted_count = 0;

        COMMIT;
        
        RAISE NOTICE 'Deleted batch of % logs...', v_deleted_count;
    END LOOP;
END;
$$;

-- Передача объявлений
CREATE OR REPLACE PROCEDURE transfer_listings(
    p_from_user_id INT,
    p_to_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM "USER" WHERE id = p_to_user_id) INTO v_user_exists;
    
    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'Target user (ID: %) does not exist.', p_to_user_id;
    END IF;

    UPDATE LISTING
    SET user_id = p_to_user_id
    WHERE user_id = p_from_user_id;

    INSERT INTO USER_ACTIVITY (user_id, action, details)
    VALUES (
        p_to_user_id, 
        'ASSETS_RECEIVED', 
        CONCAT('Listings transferred from user ID ', p_from_user_id)
    );

    COMMIT;
END;
$$;

