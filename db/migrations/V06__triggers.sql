-- Защита от скручивания пробега
CREATE OR REPLACE FUNCTION prevent_mileage_rollback()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mileage = OLD.mileage THEN
        RETURN NEW;
    END IF;

    IF NEW.mileage < OLD.mileage THEN
        RAISE EXCEPTION 'Mileage rollback detected! Old: %, New: %. You cannot lower the mileage.', OLD.mileage, NEW.mileage;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_mileage_rollback
BEFORE UPDATE ON LISTING
FOR EACH ROW
EXECUTE FUNCTION prevent_mileage_rollback();

-- Лог изменения цены
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
DECLARE
    diff DECIMAL(12, 2);
    direction VARCHAR(10);
BEGIN
    IF NEW.price IS DISTINCT FROM OLD.price THEN
        diff := NEW.price - OLD.price;
        
        IF diff > 0 THEN
            direction := 'INCREASED';
        ELSE
            direction := 'DECREASED';
        END IF;

        INSERT INTO USER_ACTIVITY (user_id, action, details)
        VALUES (
            NEW.user_id, 
            'PRICE_CHANGE', 
            CONCAT(
                'Listing ', NEW.id, ' price ', direction, ' by $', ABS(diff), '. Old: $', OLD.price, ', New: $', NEW.price
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_price_change
AFTER UPDATE ON LISTING
FOR EACH ROW
EXECUTE FUNCTION log_price_change();

-- Отслеживание VIP объявлений
CREATE OR REPLACE FUNCTION notify_vip_listing()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price >= 100_000 THEN
        INSERT INTO USER_ACTIVITY (user_id, action, details)
        VALUES (
            NEW.user_id, 
            'VIP_LISTING_DETECTED', 
            CONCAT('User posted high-value car (id: ', NEW.id, ') worth $', NEW.price)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detect_vip_listing
AFTER INSERT ON LISTING
FOR EACH ROW
EXECUTE FUNCTION notify_vip_listing();