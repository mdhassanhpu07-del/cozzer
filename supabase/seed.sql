-- ====================================================================
-- COZZER FOOTWEAR - SEED DATA SCRIPT
-- Categories, Products, Variants, Images
-- NOTE: Clearly labelled sample catalogue content for demonstration
-- ====================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES
('11111111-1111-1111-1111-111111111101', 'Casual Shoes', 'casual-shoes', 'Contemporary luxury sneakers and daily essentials crafted with premium soft leathers and ergonomic rubber outsoles.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80', 1),
('11111111-1111-1111-1111-111111111102', 'Formal Shoes', 'formal-shoes', 'Master-crafted Oxfords, Derbies, and Monkstraps designed for boardroom elegance and ceremonial distinction.', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80', 2),
('11111111-1111-1111-1111-111111111103', 'Loafers', 'loafers', 'Timeless penny loafers, tassel slip-ons, and driving shoes celebrating effortless sophistication.', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80', 3),
('11111111-1111-1111-1111-111111111104', 'Boots', 'boots', 'Sturdy Chelsea and lace-up combat boots engineered with reinforced welts and all-weather resilience.', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80', 4),
('11111111-1111-1111-1111-111111111105', 'Kids'' Shoes', 'kids-shoes', 'Gentle, structured footwear for young feet combining lightweight flexibility with durable construction.', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=80', 5),
('11111111-1111-1111-1111-111111111106', 'Ethnic Footwear', 'ethnic-footwear', 'Handcrafted Juttis and Mojaris infused with traditional Indian royal heritage, embroidery, and pure leather soles.', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=80', 6)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;

-- 2. Insert Products
INSERT INTO public.products (id, name, slug, sku, category_id, description, material, price, mrp, is_published, is_featured)
VALUES
-- Product 1: Casual
('22222222-2222-2222-2222-222222222201', 'COZZER Monolith Minimalist Sneaker', 'cozzer-monolith-minimalist-sneaker', 'COZ-CAS-001', '11111111-1111-1111-1111-111111111101', 'The Monolith is the quintessential luxury minimalist sneaker. Designed with clean architectural lines, butter-soft Italian Nappa leather, and an anti-fatigue memory foam footbed. Versatile enough to anchor both tailored trousers and weekend denim.', 'Full Grain Italian Nappa Leather, Memory Foam Insole, Vulcanized Rubber Outsole', 4499.00, 5999.00, true, true),

-- Product 2: Casual
('22222222-2222-2222-2222-222222222202', 'COZZER Aero Perforated Court Sneaker', 'cozzer-aero-perforated-court-sneaker', 'COZ-CAS-002', '11111111-1111-1111-1111-111111111101', 'Crafted for refined mobility, the Aero Court sneaker features precision laser perforations for optimal breathability, cushioned ankle support, and subtle bronze accent piping.', 'Tumbled Calfskin Leather, Breathable Microfiber Lining, High-Grip Rubber Sole', 3999.00, 4999.00, true, false),

-- Product 3: Formal
('22222222-2222-2222-2222-222222222203', 'COZZER Sovereign Wholecut Oxford', 'cozzer-sovereign-wholecut-oxford', 'COZ-FOR-001', '11111111-1111-1111-1111-111111111102', 'Sculpted from a single flawless piece of vegetable-tanned crust leather, the Sovereign Wholecut is the zenith of shoemaking precision. Features a hand-burnished deep patina, closed-channel Goodyear welted sole, and a chiselled toe profile.', 'Full Grain Crust Leather, Hand-Burnished Patina, Goodyear Welted Vegetable-Tanned Leather Sole', 6999.00, 8999.00, true, true),

-- Product 4: Formal
('22222222-2222-2222-2222-222222222204', 'COZZER Regent Double Monk Strap', 'cozzer-regent-double-monk-strap', 'COZ-FOR-002', '11111111-1111-1111-1111-111111111102', 'An assertive statement of executive authority. The Regent double monk strap boasts solid brass buckles with an antique finish, hand-painted bevelled waist, and supreme arch support.', 'Box Calf Leather, Solid Brushed Brass Buckles, Leather Sole with Rubber Inset', 6499.00, 7999.00, true, false),

-- Product 5: Loafers
('22222222-2222-2222-2222-222222222205', 'COZZER Riviera Woven Horsebit Loafer', 'cozzer-riviera-woven-horsebit-loafer', 'COZ-LOA-001', '11111111-1111-1111-1111-111111111103', 'Embodying coastal luxury, the Riviera features intricate hand-braided leather vamp detailing crowned with an understated muted bronze horsebit ornament. Flexible Blake construction ensures glove-like comfort from day one.', 'Hand-Woven Calf Leather, Muted Bronze Metallic Hardware, Blake-Stitched Sole', 5499.00, 6999.00, true, true),

-- Product 6: Loafers
('22222222-2222-2222-2222-222222222206', 'COZZER Belgravia Tassel Driving Loafer', 'cozzer-belgravia-tassel-driving-loafer', 'COZ-LOA-002', '11111111-1111-1111-1111-111111111103', 'Designed for leisurely escapades and relaxed elegance. Crafted from velvety suede with artisanal tassel accents and a segmented rubber pebble driver sole for responsive pedal control.', 'Premium Suede Leather, Glove Leather Lining, Segmented Pebble Grip Outsole', 4299.00, 5499.00, true, false),

-- Product 7: Boots
('22222222-2222-2222-2222-222222222207', 'COZZER Vanguard Chelsea Boot', 'cozzer-vanguard-chelsea-boot', 'COZ-BOO-001', '11111111-1111-1111-1111-111111111104', 'A silhouette of muscular refinement. The Vanguard Chelsea boot features water-resistant oiled nubuck leather, sturdy heavy-duty elastic side gussets, dual branded pull loops, and a storm welt rubber lug sole.', 'Water-Resistant Oiled Nubuck, Heavy Elastic Gussets, Commando Lugged Rubber Sole', 6299.00, 7999.00, true, true),

-- Product 8: Boots
('22222222-2222-2222-2222-222222222208', 'COZZER Highland Brogue Lace-Up Boot', 'cozzer-highland-brogue-lace-up-boot', 'COZ-BOO-002', '11111111-1111-1111-1111-111111111104', 'Substantial yet impeccably tailored, featuring classic wingtip brogueing, reinforced speed hooks, and waxed cotton laces over rich pebbled Scotch grain leather.', 'Scotch Grain Cowhide Leather, Antique Brass Speed Hooks, Dainite-Style Rubber Sole', 6799.00, 8499.00, true, false),

-- Product 9: Kids' Shoes
('22222222-2222-2222-2222-222222222209', 'COZZER Junior Heritage Strap Sneaker', 'cozzer-junior-heritage-strap-sneaker', 'COZ-KID-001', '11111111-1111-1111-1111-111111111105', 'Designed specifically for healthy developing feet. Features twin adjustable velcro straps for effortless self-dressing, padded collar support, and non-marking, slip-resistant soles.', 'Soft Eco-Leather, Orthotic-Friendly Removable Foam Bed, Flexible Non-Marking Rubber', 2299.00, 2999.00, true, false),

-- Product 10: Kids' Shoes
('22222222-2222-2222-2222-222222222210', 'COZZER Cadet Formal Oxford (Junior)', 'cozzer-cadet-formal-oxford-junior', 'COZ-KID-002', '11111111-1111-1111-1111-111111111105', 'Polished occasion wear for young gentlemen. Scaled with precision, offering formal sophistication without compromising on flexibility or child comfort.', 'Supple Polished Leather, Breathable Cotton Lining, Flexible Lightweight Compound Sole', 2499.00, 3299.00, true, false),

-- Product 11: Ethnic Footwear
('22222222-2222-2222-2222-222222222211', 'COZZER Royal Zardozi Embroidered Jutti', 'cozzer-royal-zardozi-embroidered-jutti', 'COZ-ETH-001', '11111111-1111-1111-1111-111111111106', 'A tribute to centuries of Indian artisanal heritage. Hand-embroidered with metallic antique gold zardozi thread on rich velvet, lined with cushioned leather to eliminate bite.', 'Fine Silk Velvet Upper, Antique Gold Thread Zardozi Work, Traditional Buffalo Leather Sole', 3799.00, 4999.00, true, true),

-- Product 12: Ethnic Footwear
('22222222-2222-2222-2222-222222222212', 'COZZER Maharaja Hand-Tanned Mojari', 'cozzer-maharaja-hand-tanned-mojari', 'COZ-ETH-002', '11111111-1111-1111-1111-111111111106', 'Pure natural vegetable-tanned leather handcrafted by heritage Rajasthani artisans. Features subtle brass pinhead motifs, upturned toe curl, and vegetable-dyed rich saddle tan finish.', 'Vegetable-Tanned Camel Leather, Brass Accent Work, Hand-Stitched Leather Sole', 3299.00, 4299.00, true, false)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    sku = EXCLUDED.sku,
    category_id = EXCLUDED.category_id,
    description = EXCLUDED.description,
    material = EXCLUDED.material,
    price = EXCLUDED.price,
    mrp = EXCLUDED.mrp,
    is_published = EXCLUDED.is_published,
    is_featured = EXCLUDED.is_featured;

-- 3. Insert Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
-- Monolith Sneaker
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80', 'COZZER Monolith Minimalist Sneaker - Side Profile in Obsidian Black', 1, true),
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80', 'COZZER Monolith Minimalist Sneaker - Angled Studio Shot', 2, false),
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80', 'COZZER Monolith Minimalist Sneaker - Sole Detail and Texture', 3, false),

-- Aero Court Sneaker
('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80', 'COZZER Aero Perforated Court Sneaker - Front View', 1, true),
('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80', 'COZZER Aero Perforated Court Sneaker - Lateral View', 2, false),

-- Sovereign Wholecut Oxford
('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80', 'COZZER Sovereign Wholecut Oxford - Hand-Burnished Patina View', 1, true),
('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1478180170839-2e7075e60e31?auto=format&fit=crop&w=1200&q=80', 'COZZER Sovereign Wholecut Oxford - Overhead Toe Symmetry', 2, false),

-- Regent Double Monk Strap
('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80', 'COZZER Regent Double Monk Strap - Brass Buckles Close-Up', 1, true),

-- Riviera Woven Loafer
('22222222-2222-2222-2222-222222222205', 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1200&q=80', 'COZZER Riviera Woven Horsebit Loafer - Muted Bronze Hardware', 1, true),

-- Belgravia Tassel Driving Loafer
('22222222-2222-2222-2222-222222222206', 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=80', 'COZZER Belgravia Tassel Driving Loafer - Velvety Suede', 1, true),

-- Vanguard Chelsea Boot
('22222222-2222-2222-2222-222222222207', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80', 'COZZER Vanguard Chelsea Boot - Water-Resistant Oiled Nubuck', 1, true),

-- Highland Brogue Boot
('22222222-2222-2222-2222-222222222208', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', 'COZZER Highland Brogue Lace-Up Boot - Wingtip Detail', 1, true),

-- Junior Heritage Sneaker
('22222222-2222-2222-2222-222222222209', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80', 'COZZER Junior Heritage Strap Sneaker - Double Straps', 1, true),

-- Cadet Formal Oxford (Junior)
('22222222-2222-2222-2222-222222222210', 'https://images.unsplash.com/photo-1582844254884-2eefea8a7861?auto=format&fit=crop&w=1200&q=80', 'COZZER Cadet Formal Oxford - Polished Finish', 1, true),

-- Royal Zardozi Jutti
('22222222-2222-2222-2222-222222222211', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80', 'COZZER Royal Zardozi Embroidered Jutti - Velvet and Gold Thread', 1, true),

-- Maharaja Hand-Tanned Mojari
('22222222-2222-2222-2222-222222222212', 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=1200&q=80', 'COZZER Maharaja Hand-Tanned Mojari - Traditional Leatherwork', 1, true);

-- 4. Insert Variants (Sizes & Colours with authentic stock counts)
INSERT INTO public.product_variants (product_id, size, colour, colour_code, sku, stock_quantity, is_available)
VALUES
-- Monolith Sneaker (COZ-CAS-001) - Obsidian Black
('22222222-2222-2222-2222-222222222201', 'UK 7', 'Obsidian Black', '#171717', 'COZ-CAS-001-BLK-07', 8, true),
('22222222-2222-2222-2222-222222222201', 'UK 8', 'Obsidian Black', '#171717', 'COZ-CAS-001-BLK-08', 12, true),
('22222222-2222-2222-2222-222222222201', 'UK 9', 'Obsidian Black', '#171717', 'COZ-CAS-001-BLK-09', 5, true),
('22222222-2222-2222-2222-222222222201', 'UK 10', 'Obsidian Black', '#171717', 'COZ-CAS-001-BLK-10', 2, true),
('22222222-2222-2222-2222-222222222201', 'UK 11', 'Obsidian Black', '#171717', 'COZ-CAS-001-BLK-11', 0, false),

-- Monolith Sneaker (COZ-CAS-001) - Warm Ivory
('22222222-2222-2222-2222-222222222201', 'UK 7', 'Warm Ivory', '#F5F1E8', 'COZ-CAS-001-IVR-07', 6, true),
('22222222-2222-2222-2222-222222222201', 'UK 8', 'Warm Ivory', '#F5F1E8', 'COZ-CAS-001-IVR-08', 10, true),
('22222222-2222-2222-2222-222222222201', 'UK 9', 'Warm Ivory', '#F5F1E8', 'COZ-CAS-001-IVR-09', 4, true),
('22222222-2222-2222-2222-222222222201', 'UK 10', 'Warm Ivory', '#F5F1E8', 'COZ-CAS-001-IVR-10', 1, true),

-- Sovereign Wholecut Oxford (COZ-FOR-001) - Hand-Burnished Cognac
('22222222-2222-2222-2222-222222222203', 'UK 7', 'Hand-Burnished Cognac', '#7D4721', 'COZ-FOR-001-COG-07', 4, true),
('22222222-2222-2222-2222-222222222203', 'UK 8', 'Hand-Burnished Cognac', '#7D4721', 'COZ-FOR-001-COG-08', 7, true),
('22222222-2222-2222-2222-222222222203', 'UK 9', 'Hand-Burnished Cognac', '#7D4721', 'COZ-FOR-001-COG-09', 6, true),
('22222222-2222-2222-2222-222222222203', 'UK 10', 'Hand-Burnished Cognac', '#7D4721', 'COZ-FOR-001-COG-10', 0, false),

-- Riviera Woven Loafer (COZ-LOA-001) - Muted Bronze Tan
('22222222-2222-2222-2222-222222222205', 'UK 7', 'Bronze Saddle Tan', '#9B7B50', 'COZ-LOA-001-TAN-07', 5, true),
('22222222-2222-2222-2222-222222222205', 'UK 8', 'Bronze Saddle Tan', '#9B7B50', 'COZ-LOA-001-TAN-08', 8, true),
('22222222-2222-2222-2222-222222222205', 'UK 9', 'Bronze Saddle Tan', '#9B7B50', 'COZ-LOA-001-TAN-09', 3, true),
('22222222-2222-2222-2222-222222222205', 'UK 10', 'Bronze Saddle Tan', '#9B7B50', 'COZ-LOA-001-TAN-10', 5, true),

-- Vanguard Chelsea Boot (COZ-BOO-001) - Espresso Brown
('22222222-2222-2222-2222-222222222207', 'UK 7', 'Espresso Brown', '#2B1C15', 'COZ-BOO-001-ESP-07', 3, true),
('22222222-2222-2222-2222-222222222207', 'UK 8', 'Espresso Brown', '#2B1C15', 'COZ-BOO-001-ESP-08', 6, true),
('22222222-2222-2222-2222-222222222207', 'UK 9', 'Espresso Brown', '#2B1C15', 'COZ-BOO-001-ESP-09', 4, true),
('22222222-2222-2222-2222-222222222207', 'UK 10', 'Espresso Brown', '#2B1C15', 'COZ-BOO-001-ESP-10', 2, true),

-- Royal Zardozi Jutti (COZ-ETH-001) - Midnight Gold
('22222222-2222-2222-2222-222222222211', 'UK 7', 'Midnight Gold Velvet', '#1B1E2B', 'COZ-ETH-001-GLD-07', 5, true),
('22222222-2222-2222-2222-222222222211', 'UK 8', 'Midnight Gold Velvet', '#1B1E2B', 'COZ-ETH-001-GLD-08', 7, true),
('22222222-2222-2222-2222-222222222211', 'UK 9', 'Midnight Gold Velvet', '#1B1E2B', 'COZ-ETH-001-GLD-09', 2, true),
('22222222-2222-2222-2222-222222222211', 'UK 10', 'Midnight Gold Velvet', '#1B1E2B', 'COZ-ETH-001-GLD-10', 4, true)
ON CONFLICT (product_id, size, colour) DO NOTHING;
