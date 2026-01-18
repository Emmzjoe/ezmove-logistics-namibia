-- ==================== ALTER MIGRATION ====================
-- Add missing columns and tables to existing schema
-- Version: 1.0.1

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== ALTER DRIVER_PROFILES ====================
-- Add availability_status column (maps to old 'availability' boolean)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='availability_status') THEN
        ALTER TABLE driver_profiles
        ADD COLUMN availability_status VARCHAR(20) DEFAULT 'offline'
        CHECK (availability_status IN ('online', 'offline', 'busy'));

        -- Map old availability boolean to new availability_status
        UPDATE driver_profiles
        SET availability_status = CASE
            WHEN availability = true THEN 'online'
            ELSE 'offline'
        END;
    END IF;
END $$;

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- total_ratings column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='total_ratings') THEN
        ALTER TABLE driver_profiles ADD COLUMN total_ratings INTEGER DEFAULT 0;
    END IF;

    -- rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='rejection_reason') THEN
        ALTER TABLE driver_profiles ADD COLUMN rejection_reason TEXT;
    END IF;

    -- insurance_number column (map from insurance_policy)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='insurance_number') THEN
        ALTER TABLE driver_profiles ADD COLUMN insurance_number VARCHAR(100);
        UPDATE driver_profiles SET insurance_number = insurance_policy;
    END IF;

    -- Map current_latitude/longitude to current_lat/lng for consistency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='current_lat') THEN
        ALTER TABLE driver_profiles ADD COLUMN current_lat DECIMAL(10,8);
        UPDATE driver_profiles SET current_lat = current_latitude;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='driver_profiles' AND column_name='current_lng') THEN
        ALTER TABLE driver_profiles ADD COLUMN current_lng DECIMAL(11,8);
        UPDATE driver_profiles SET current_lng = current_longitude;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_driver_availability_status ON driver_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_driver_location_new ON driver_profiles(current_lat, current_lng);

-- ==================== ALTER JOBS ====================
-- Add missing columns to jobs table
DO $$
BEGIN
    -- Map pickup location columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='pickup_lat') THEN
        ALTER TABLE jobs ADD COLUMN pickup_lat DECIMAL(10,8);
        -- Extract from pickup_location if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='pickup_location') THEN
            UPDATE jobs SET pickup_lat = (pickup_location->>'lat')::DECIMAL(10,8);
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='pickup_lng') THEN
        ALTER TABLE jobs ADD COLUMN pickup_lng DECIMAL(11,8);
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='pickup_location') THEN
            UPDATE jobs SET pickup_lng = (pickup_location->>'lng')::DECIMAL(11,8);
        END IF;
    END IF;

    -- Map delivery location columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='delivery_lat') THEN
        ALTER TABLE jobs ADD COLUMN delivery_lat DECIMAL(10,8);
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='delivery_location') THEN
            UPDATE jobs SET delivery_lat = (delivery_location->>'lat')::DECIMAL(10,8);
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='delivery_lng') THEN
        ALTER TABLE jobs ADD COLUMN delivery_lng DECIMAL(11,8);
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='delivery_location') THEN
            UPDATE jobs SET delivery_lng = (delivery_location->>'lng')::DECIMAL(11,8);
        END IF;
    END IF;

    -- Add base_price if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='base_price') THEN
        ALTER TABLE jobs ADD COLUMN base_price DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add distance_price if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='distance_price') THEN
        ALTER TABLE jobs ADD COLUMN distance_price DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add time_price if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='time_price') THEN
        ALTER TABLE jobs ADD COLUMN time_price DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add surge_multiplier if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='surge_multiplier') THEN
        ALTER TABLE jobs ADD COLUMN surge_multiplier DECIMAL(3,2) DEFAULT 1.00;
    END IF;

    -- Add actual_distance if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='actual_distance') THEN
        ALTER TABLE jobs ADD COLUMN actual_distance DECIMAL(10,2);
    END IF;

    -- Add actual_duration if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='actual_duration') THEN
        ALTER TABLE jobs ADD COLUMN actual_duration INTEGER;
    END IF;

    -- Add client_signature if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='client_signature') THEN
        ALTER TABLE jobs ADD COLUMN client_signature TEXT;
    END IF;

    -- Add driver_notes if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='jobs' AND column_name='driver_notes') THEN
        ALTER TABLE jobs ADD COLUMN driver_notes TEXT;
    END IF;
END $$;

-- Create indexes for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_pickup_location_new ON jobs(pickup_lat, pickup_lng);
CREATE INDEX IF NOT EXISTS idx_jobs_delivery_location_new ON jobs(delivery_lat, delivery_lng);

-- ==================== ALTER JOB_TRACKING ====================
-- Update job_tracking to use lat/lng instead of location
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='lat') THEN
        ALTER TABLE job_tracking ADD COLUMN lat DECIMAL(10,8);
        -- Extract from location if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='location') THEN
            UPDATE job_tracking SET lat = (location->>'lat')::DECIMAL(10,8);
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='lng') THEN
        ALTER TABLE job_tracking ADD COLUMN lng DECIMAL(11,8);
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='location') THEN
            UPDATE job_tracking SET lng = (location->>'lng')::DECIMAL(11,8);
        END IF;
    END IF;

    -- Add speed column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='speed') THEN
        ALTER TABLE job_tracking ADD COLUMN speed DECIMAL(5,2);
    END IF;

    -- Add heading column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='heading') THEN
        ALTER TABLE job_tracking ADD COLUMN heading DECIMAL(5,2);
    END IF;

    -- Add accuracy column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='accuracy') THEN
        ALTER TABLE job_tracking ADD COLUMN accuracy DECIMAL(8,2);
    END IF;

    -- Add battery_level column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='job_tracking' AND column_name='battery_level') THEN
        ALTER TABLE job_tracking ADD COLUMN battery_level INTEGER;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tracking_location_new ON job_tracking(lat, lng);

-- ==================== CREATE REFRESH_TOKENS TABLE ====================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ==================== FUNCTIONS ====================

-- Function to calculate distance between two points using Haversine formula (in kilometers)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DOUBLE PRECISION,
    lon1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION,
    lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    R CONSTANT DOUBLE PRECISION := 6371.0; -- Earth's radius in kilometers
    dLat DOUBLE PRECISION;
    dLon DOUBLE PRECISION;
    a DOUBLE PRECISION;
    c DOUBLE PRECISION;
BEGIN
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);

    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLon/2) * sin(dLon/2);

    c := 2 * atan2(sqrt(a), sqrt(1-a));

    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION find_nearby_drivers(
    pickup_lat DOUBLE PRECISION,
    pickup_lon DOUBLE PRECISION,
    vehicle_type_filter VARCHAR(50),
    radius_km DOUBLE PRECISION DEFAULT 10.0
)
RETURNS TABLE (
    driver_id UUID,
    driver_name VARCHAR(255),
    vehicle_type VARCHAR(50),
    rating DECIMAL(3,2),
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dp.user_id,
        u.full_name,
        dp.vehicle_type::VARCHAR(50),
        dp.rating,
        calculate_distance(pickup_lat, pickup_lon, dp.current_lat, dp.current_lng) AS distance
    FROM driver_profiles dp
    JOIN users u ON dp.user_id = u.id
    WHERE
        dp.availability_status = 'online'
        AND dp.verification_status::VARCHAR = 'verified'
        AND u.status::VARCHAR = 'active'
        AND dp.vehicle_type::VARCHAR = vehicle_type_filter
        AND dp.current_lat IS NOT NULL
        AND dp.current_lng IS NOT NULL
        AND calculate_distance(pickup_lat, pickup_lon, dp.current_lat, dp.current_lng) <= radius_km
    ORDER BY distance ASC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ==================== VIEWS ====================

-- Active jobs view (updated)
CREATE OR REPLACE VIEW active_jobs AS
SELECT
    j.*,
    u_client.full_name AS client_name,
    u_client.phone AS client_phone,
    u_driver.full_name AS driver_name,
    u_driver.phone AS driver_phone,
    dp.license_plate,
    dp.vehicle_make,
    dp.vehicle_model
FROM jobs j
LEFT JOIN users u_client ON j.client_id = u_client.id
LEFT JOIN users u_driver ON j.driver_id = u_driver.id
LEFT JOIN driver_profiles dp ON j.driver_id = dp.user_id
WHERE j.status::VARCHAR IN ('pending', 'accepted', 'in_progress');

-- Driver statistics view (updated)
CREATE OR REPLACE VIEW driver_stats AS
SELECT
    dp.user_id,
    u.full_name,
    u.email,
    dp.vehicle_type::VARCHAR AS vehicle_type,
    dp.rating,
    dp.total_ratings,
    dp.total_jobs,
    dp.total_earnings,
    dp.availability_status,
    COUNT(CASE WHEN j.status::VARCHAR = 'completed' THEN 1 END) AS completed_jobs,
    COUNT(CASE WHEN j.status::VARCHAR = 'cancelled' THEN 1 END) AS cancelled_jobs,
    AVG(CASE WHEN j.status::VARCHAR = 'completed' THEN j.driver_rating END) AS avg_rating
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
LEFT JOIN jobs j ON dp.user_id = j.driver_id
GROUP BY dp.user_id, u.full_name, u.email, dp.vehicle_type, dp.rating,
         dp.total_ratings, dp.total_jobs, dp.total_earnings, dp.availability_status;

-- ==================== MIGRATION COMPLETE ====================
-- Schema version: 1.0.1
-- Added missing columns to existing tables
-- Created refresh_tokens table
-- Added utility functions
-- Updated views
