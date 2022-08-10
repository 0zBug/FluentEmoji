// ==UserScript==
// @name FluentEmoji
// @author Bug
// @description Use microsoft fluent emojis on discord
// @version 1.0
// @match https://*.discord.com/*
// ==/UserScript==

(function() {
'use strict';

var Discord;
var Utils = {
    Log: (message) => { console.log(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Warn: (message) => { console.warn(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Error: (message) => { console.error(`%c[FreeEmojis] %c${message}`, `color:#0cf;font-weight:bold`, "") },
    Webpack: function() {
        if(this.cachedWebpack) return this.cachedWebpack;

        let webpackExports;

        if(typeof BdApi !== "undefined" && BdApi?.findModuleByProps && BdApi?.findModule) {
            return this.cachedWebpack = { findModule: BdApi.findModule, findModuleByUniqueProperties: (props) => BdApi.findModuleByProps.apply(null, props) };
        }

        else if(Discord.window.webpackChunkdiscord_app != null) {
            const ids = ['__extra_id__'];
            Discord.window.webpackChunkdiscord_app.push([ids, {}, (req) => {
                webpackExports = req;
                ids.length = 0;
            }]);
        }

        else if(Discord.window.webpackJsonp != null) {
            webpackExports = typeof(Discord.window.webpackJsonp) === 'function' ? Discord.window.webpackJsonp(
                [], {'__extra_id__': (module, _export_, req) => {_export_.default = req}}, ['__extra_id__']
            ).default : Discord.window.webpackJsonp.push([
                [], {'__extra_id__': (_module_, exports, req) => { _module_.exports = req }}, [['__extra_id__']]
            ]);

            delete webpackExports.m['__extra_id__'];
            delete webpackExports.c['__extra_id__'];
        }
        else return null;

        const findModule = (filter) => {
            for(let i in webpackExports.c) {
                if(webpackExports.c.hasOwnProperty(i)) {
                    let m = webpackExports.c[i].exports;

                    if(!m) continue;
                    if(m.__esModule && m.default) m = m.default;
                    if(filter(m)) return m;
                }
            }

            return null;
        };

        const findModuleByUniqueProperties = (propNames) => findModule(module => propNames.every(prop => module[prop] !== undefined));

        return this.cachedWebpack = { findModule, findModuleByUniqueProperties };
    }
};

var emojis = {
	"b": 1, "m": 1, "x": 1, "a": 1, "o": 1, "o2": 1, "on": 1, "id": 1, 
    "sa": 1, "tm": 1, "ok": 1, "tv": 1, "ng": 1, "ab": 1, "cd": 1, "wc": 1, "vs": 1, 
	"cl": 1, "up": 1, "key": 1, "leo": 1, "100": 1, "fax": 1, "imp": 1, "dna": 1, "cry": 1, 
	"joy": 1, "dvd": 1, "end": 1, "egg": 1, "gun": 1, "mag": 1, "oil": 1, "map": 1, "two": 1, 
	"top": 1, "sos": 1, "urn": 1, "yen": 1, "vhs": 1, "man": 1, "sob": 1, "six": 1, "nod": 1, 
	"new": 1, "ski": 1, "one": 1, "sad": 1, "pie": 1, "bed": 1, "zzz": 1, "art": 1, "axe": 1, 
	"abc": 1, "atm": 1, "back": 1, "mute": 1, "nerd": 1, "milk": 1, "mens": 1, "mega": 1, "mate": 1, 
	"lock": 1, "nine": 1, "loop": 1, "mask": 1, "oden": 1, "call": 1, "cake": 1, "rice": 1, "rage": 1, 
	"rofl": 1, "sake": 1, "link": 1, "poop": 1, "pick": 1, "pill": 1, "park": 1, "bulb": 1, "koko": 1, 
	"knot": 1, "kiwi": 1, "free": 1, "four": 1, "gear": 1, "coin": 1, "gift": 1, "five": 1, "drum": 1, 
	"dash": 1, "euro": 1, "door": 1, "cool": 1, "salt": 1, "coat": 1, "golf": 1, "idea": 1, "hook": 1, 
	"kiss": 1, "kite": 1, "goal": 1, "atom": 1, "hole": 1, "grin": 1, "clap": 1, "hash": 1, "herb": 1, 
	"sari": 1, "pear": 1, "bank": 1, "tent": 1, "wave": 1, "whew": 1, "sled": 1, "wink": 1, "wait": 1, 
	"soap": 1, "taco": 1, "soon": 1, "abcd": 1, "book": 1, "bomb": 1, "bell": 1, "boot": 1, "1234": 1, 
	"bike": 1, "boom": 1, "zero": 1, "yarn": 1, "stew": 1, "tram": 1, "u6307": 1, "u6e80": 1, "hotel": 1, 
	"u7121": 1, "kaaba": 1, "homes": 1, "u6709": 1, "heart": 1, "jeans": 1, "u6708": 1, "house": 1, "japan": 1, 
	"scarf": 1, "u7981": 1, "dress": 1, "eight": 1, "eject": 1, "8ball": 1, "yo_yo": 1, "dango": 1, "dizzy": 1, 
	"cupid": 1, "u7533": 1, "woman": 1, "foggy": 1, "virgo": 1, "u7a7a": 1, "flags": 1, "u55b6": 1, "fries": 1, 
	"ghost": 1, "weary": 1, "u5408": 1, "libra": 1, "knife": 1, "anger": 1, "pizza": 1, "apple": 1, "pouch": 1, 
	"skull": 1, "peace": 1, "peach": 1, "smile": 1, "pager": 1, "pound": 1, "radio": 1, "seven": 1, "angry": 1, 
	"salad": 1, "purse": 1, "shake": 1, "ramen": 1, "razor": 1, "shirt": 1, "u5272": 1, "onion": 1, "olive": 1, 
	"tools": 1, "mango": 1, "three": 1, "medal": 1, "alien": 1, "label": 1, "train": 1, "tulip": 1, "aries": 1, 
	"melon": 1, "metal": 1, "socks": 1, "angel": 1, "sushi": 1, "sound": 1, "moyai": 1, "spoon": 1, "metro": 1, 
	"crown": 1, "lemon": 1, "cross": 1, "banjo": 1, "broom": 1, "chair": 1, "bread": 1, "bagel": 1, "books": 1, 
	"clubs": 1, "chart": 1, "beach": 1, "candy": 1, "couch": 1, "bacon": 1, "clown": 1, "bento": 1, "bamboo": 1, 
	"camera": 1, "abacus": 1, "repeat": 1, "bricks": 1, "hockey": 1, "hotdog": 1, "ribbon": 1, "rewind": 1, "boxing": 1, 
	"window": 1, "cancer": 1, "taurus": 1, "cinema": 1, "hushed": 1, "bucket": 1, "banana": 1, "teapot": 1, "briefs": 1, 
	"hearts": 1, "basket": 1, "coffin": 1, "guitar": 1, "gemini": 1, "pisces": 1, "garlic": 1, "gloves": 1, "grapes": 1, 
	"sponge": 1, "pinata": 1, "pencil": 1, "office": 1, "hammer": 1, "waffle": 1, "cactus": 1, "sandal": 1, "unlock": 1, 
	"potato": 1, "accept": 1, "oyster": 1, "fondue": 1, "violin": 1, "butter": 1, "island": 1, "spades": 1, "church": 1, 
	"selfie": 1, "ladder": 1, "tophat": 1, "shield": 1, "thread": 1, "secret": 1, "crayon": 1, "cowboy": 1, "scroll": 1, 
	"cheese": 1, "trophy": 1, "candle": 1, "ledger": 1, "ticket": 1, "chains": 1, "sleepy": 1, "magnet": 1, "smiley": 1, 
	"desert": 1, "tomato": 1, "shower": 1, "dagger": 1, "carrot": 1, "shorts": 1, "mirror": 1, "scream": 1, "toilet": 1, 
	"cookie": 1, "mosque": 1, "kimono": 1, "jigsaw": 1, "wrench": 1, "anchor": 1, "tennis": 1, "scales": 1, "womens": 1, 
	"e_mail": 1, "school": 1, "bikini": 1, "pensive": 1, "camping": 1, "bellhop": 1, "peanuts": 1, "tickets": 1, "mailbox": 1, 
	"amphora": 1, "volcano": 1, "mahjong": 1, "triumph": 1, "alembic": 1, "toolbox": 1, "trumpet": 1, "burrito": 1, "handbag": 1, 
	"joy_cat": 1, "parking": 1, "bathtub": 1, "menorah": 1, "clapper": 1, "battery": 1, "kissing": 1, "calling": 1, "sunrise": 1, 
	"stadium": 1, "no_bell": 1, "package": 1, "syringe": 1, "busstop": 1, "trident": 1, "hugging": 1, "joy_dog": 1, "necktie": 1, 
	"station": 1, "symbols": 1, "luggage": 1, "sad_dog": 1, "feather": 1, "sparkle": 1, "custard": 1, "customs": 1, "wedding": 1, 
	"refresh": 1, "speaker": 1, "receipt": 1, "flushed": 1, "pushpin": 1, "printer": 1, "falafel": 1, "blossom": 1, "worried": 1, 
	"bouquet": 1, "cooking": 1, "scooter": 1, "factory": 1, "diamond": 1, "bowling": 1, "balloon": 1, "rosette": 1, "desktop": 1, 
	"smoking": 1, "fearful": 1, "cupcake": 1, "postbox": 1, "plunger": 1, "warning": 1, "coconut": 1, "placard": 1, "popcorn": 1, 
	"pretzel": 1, "goggles": 1, "laughing": 1, "mountain": 1, "motorway": 1, "elevator": 1, "fuelpump": 1, "cucumber": 1, "movember": 1, 
	"infinity": 1, "mushroom": 1, "sandwich": 1, "game_die": 1, "grinning": 1, "lollipop": 1, "shamrock": 1, "card_box": 1, "minidisc": 1, 
	"dumpling": 1, "lacrosse": 1, "chestnut": 1, "doughnut": 1, "scissors": 1, "cherries": 1, "thumbsup": 1, "softball": 1, "asterisk": 1, 
	"joystick": 1, "eggplant": 1, "dividers": 1, "moneybag": 1, "keyboard": 1, "arrow_up": 1, "thinking": 1, "bookmark": 1, "scorpius": 1, 
	"daydream": 1, "sparkles": 1, "hibiscus": 1, "confused": 1, "notebook": 1, "bangbang": 1, "lipstick": 1, "aquarius": 1, "question": 1, 
	"football": 1, "baseball": 1, "calendar": 1, "wasnt_me": 1, "sleeping": 1, "broccoli": 1, "underage": 1, "restroom": 1, "relieved": 1, 
	"no_entry": 1, "yin_yang": 1, "facepalm": 1, "beginner": 1, "ice_cube": 1, "icecream": 1, "frowning": 1, "lab_coat": 1, "headbang": 1, 
	"hot_face": 1, "new_moon": 1, "pancakes": 1, "computer": 1, "hospital": 1, "capricorn": 1, "blue_book": 1, "smirk_cat": 1, "mag_right": 1, 
	"mans_shoe": 1, "pineapple": 1, "boomerang": 1, "briefcase": 1, "projector": 1, "synagogue": 1, "newspaper": 1, "tangerine": 1, "om_symbol": 1, 
	"palm_tree": 1, "ping_pong": 1, "ophiuchus": 1, "black_nib": 1, "paperclip": 1, "mistletoe": 1, "rice_ball": 1, "spaghetti": 1, "saxophone": 1, 
	"satellite": 1, "test_tube": 1, "moon_cake": 1, "telephone": 1, "sarcastic": 1, "telescope": 1, "sad_robot": 1, "anguished": 1, "sad_koala": 1, 
	"persevere": 1, "smile_cat": 1, "hamburger": 1, "cityscape": 1, "honey_pot": 1, "fireworks": 1, "wavy_dash": 1, "fish_cake": 1, "city_dusk": 1, 
	"ice_skate": 1, "bar_chart": 1, "joy_robot": 1, "joy_koala": 1, "diya_lamp": 1, "high_heel": 1, "flatbread": 1, "clipboard": 1, "headstone": 1, 
	"grimacing": 1, "high_five": 1, "cold_face": 1, "accordion": 1, "full_moon": 1, "hen_dance": 1, "heartbeat": 1, "trackball": 1, "ice_cream": 1, 
	"biohazard": 1, "zany_face": 1, "long_drum": 1, "badminton": 1, "croissant": 1, "tired_face": 1, "watermelon": 1, "blue_heart": 1, "no_smoking": 1, 
	"flashlight": 1, "arrow_down": 1, "toothbrush": 1, "lying_face": 1, "arrow_left": 1, "hot_pepper": 1, "registered": 1, "curly_loop": 1, "newspaper2": 1, 
	"red_circle": 1, "red_square": 1, "blank_face": 1, "basketball": 1, "heartpulse": 1, "sunglasses": 1, "bubble_tea": 1, "love_hotel": 1, "paintbrush": 1, 
	"paperclips": 1, "petri_dish": 1, "headphones": 1, "volleyball": 1, "hotsprings": 1, "video_game": 1, "heart_eyes": 1, "cold_sweat": 1, "loud_sound": 1, 
	"green_book": 1, "play_pause": 1, "gift_heart": 1, "magic_wand": 1, "repeat_one": 1, "maple_leaf": 1, "card_index": 1, "sad_monkey": 1, "wind_chime": 1, 
	"woozy_face": 1, "eyeglasses": 1, "microscope": 1, "dizzy_face": 1, "chopsticks": 1, "astonished": 1, "joy_monkey": 1, "mount_fuji": 1, "billed_cap": 1, 
	"chess_pawn": 1, "earth_asia": 1, "ballot_box": 1, "microphone": 1, "womans_hat": 1, "shaved_ice": 1, "name_badge": 1, "track_next": 1, "mouse_trap": 1, 
	"wheelchair": 1, "rice_scene": 1, "trolleybus": 1, "inbox_tray": 1, "scream_cat": 1, "keycap_ten": 1, "brown_heart": 1, "ear_of_rice": 1, "dollar_sign": 1, 
	"post_office": 1, "diving_mask": 1, "green_apple": 1, "tokyo_tower": 1, "smiling_imp": 1, "green_heart": 1, "exclamation": 1, "film_frames": 1, "compression": 1, 
	"first_place": 1, "wilted_rose": 1, "railway_car": 1, "blueberries": 1, "radioactive": 1, "white_heart": 1, "fallen_leaf": 1, "firecracker": 1, "anger_right": 1, 
	"cut_of_meat": 1, "postal_horn": 1, "blue_square": 1, "safety_vest": 1, "pouting_cat": 1, "poultry_leg": 1, "frame_photo": 1, "floppy_disk": 1, "file_folder": 1, 
	"flying_disc": 1, "sagittarius": 1, "credit_card": 1, "wastebasket": 1, "see_no_evil": 1, "speech_left": 1, "blue_circle": 1, "money_mouth": 1, "cactus_love": 1, 
	"thermometer": 1, "black_joker": 1, "kissing_cat": 1, "stop_button": 1, "third_place": 1, "orange_book": 1, "microphone2": 1, "interrobang": 1, "sweat_drops": 1, 
	"baby_bottle": 1, "no_bicycles": 1, "hammer_pick": 1, "city_sunset": 1, "bell_pepper": 1, "circus_tent": 1, "hiking_boot": 1, "canned_food": 1, "takeout_box": 1, 
	"black_heart": 1, "loudspeaker": 1, "baby_symbol": 1, "closed_book": 1, "stethoscope": 1, "outbox_tray": 1, "leafy_green": 1, "arrow_right": 1, "love_letter": 1, 
	"fast_forward": 1, "musical_note": 1, "level_slider": 1, "field_hockey": 1, "capital_abcd": 1, "slight_smile": 1, "cricket_game": 1, "file_cabinet": 1, "slot_machine": 1, 
	"rice_cracker": 1, "nazar_amulet": 1, "beverage_box": 1, "white_circle": 1, "rolling_eyes": 1, "meat_on_bone": 1, "red_envelope": 1, "mobile_phone": 1, "yellow_heart": 1, 
	"disappointed": 1, "thong_sandal": 1, "boxing_glove": 1, "left_luggage": 1, "mortar_board": 1, "yawning_face": 1, "zipper_mouth": 1, "white_flower": 1, "black_circle": 1, 
	"movie_camera": 1, "ballet_shoes": 1, "pause_button": 1, "fried_shrimp": 1, "french_bread": 1, "prayer_beads": 1, "probing_cane": 1, "green_circle": 1, "hear_no_evil": 1, 
	"purple_heart": 1, "oncoming_bus": 1, "broken_heart": 1, "brown_circle": 1, "brown_square": 1, "orange_heart": 1, "potted_plant": 1, "pickup_truck": 1, "video_camera": 1, 
	"hindu_temple": 1, "radio_button": 1, "green_square": 1, "head_bandage": 1, "sweet_potato": 1, "pen_fountain": 1, "nut_and_bolt": 1, "fleur_de_lis": 1, "pleading_face": 1, 
	"pen_ballpoint": 1, "traffic_light": 1, "athletic_shoe": 1, "mending_heart": 1, "grey_question": 1, "orange_circle": 1, "yellow_circle": 1, "partying_face": 1, "sneezing_face": 1, 
	"orange_square": 1, "carpentry_saw": 1, "star_of_david": 1, "curling_stone": 1, "bookmark_tabs": 1, "shushing_face": 1, "shopping_cart": 1, "crescent_moon": 1, "shinto_shrine": 1, 
	"yellow_square": 1, "tanabata_tree": 1, "baggage_claim": 1, "kissing_heart": 1, "purple_circle": 1, "roll_of_paper": 1, "round_pushpin": 1, "confetti_ball": 1, "face_vomiting": 1, 
	"drooling_face": 1, "purple_square": 1, "arrow_forward": 1, "no_entry_sign": 1, "musical_score": 1, "nesting_dolls": 1, "railway_track": 1, "rainbow_smile": 1, "japanese_ogre": 1, 
	"face_exhaling": 1, "werewolf_howl": 1, "heart_on_fire": 1, "bow_and_arrow": 1, "mountain_snow": 1, "electric_plug": 1, "space_invader": 1, "record_button": 1, "arrow_up_down": 1, 
	"potable_water": 1, "chocolate_bar": 1, "control_knobs": 1, "squeeze_bottle": 1, "womans_clothes": 1, "beach_umbrella": 1, "speech_balloon": 1, "straight_ruler": 1, "sunglasses_cat": 1, 
	"track_previous": 1, "sunglasses_dog": 1, "vibration_mode": 1, "notepad_spiral": 1, "arrow_up_small": 1, "military_medal": 1, "face_in_clouds": 1, "arrow_backward": 1, "holiday_spirit": 1, 
	"cherry_blossom": 1, "fortune_cookie": 1, "carousel_horse": 1, "page_facing_up": 1, "exploding_head": 1, "page_with_curl": 1, "nauseated_face": 1, "orthodox_cross": 1, "evergreen_tree": 1, 
	"heart_eyes_dog": 1, "medical_symbol": 1, "earth_americas": 1, "crossed_swords": 1, "mailbox_closed": 1, "rotating_light": 1, "fork_and_knife": 1, "no_pedestrians": 1, "cup_with_straw": 1, 
	"school_satchel": 1, "expressionless": 1, "heart_eyes_cat": 1, "deciduous_tree": 1, "low_brightness": 1, "disguised_face": 1, "arrow_double_up": 1, "thought_balloon": 1, "fingers_crossed": 1, 
	"wheel_of_dharma": 1, "military_helmet": 1, "heavy_plus_sign": 1, "signal_strength": 1, "european_castle": 1, "japanese_castle": 1, "crying_cat_face": 1, "izakaya_lantern": 1, "japanese_goblin": 1, 
	"dark_sunglasses": 1, "house_abandoned": 1, "performing_arts": 1, "bowl_with_spoon": 1, "congratulations": 1, "bridge_at_night": 1, "high_brightness": 1, "mobile_phone_off": 1, "heart_eyes_robot": 1, 
	"arrow_lower_left": 1, "heavy_check_mark": 1, "heavy_minus_sign": 1, "arrow_upper_left": 1, "heart_decoration": 1, "thermometer_face": 1, "arrow_right_hook": 1, "left_right_arrow": 1, "heart_eyes_koala": 1, 
	"money_with_wings": 1, "no_mobile_phones": 1, "mountain_railway": 1, "womans_flat_shoe": 1, "passport_control": 1, "open_file_folder": 1, "grey_exclamation": 1, "stuck_out_tounge": 1, "sunglasses_koala": 1, 
	"bullettrain_side": 1, "revolving_hearts": 1, "skull_crossbones": 1, "place_of_worship": 1, "six_pointed_star": 1, "department_store": 1, "white_check_mark": 1, "triangular_ruler": 1, "night_with_stars": 1, 
	"sunglasses_robot": 1, "musical_keyboard": 1, "fork_knife_plate": 1, "four_leaf_clover": 1, "adhesive_bandage": 1, "arrows_clockwise": 1, "arrow_down_small": 1, "arrow_heading_up": 1, "currency_exchange": 1, 
	"house_with_garden": 1, "face_with_monocle": 1, "helmet_with_cross": 1, "heart_exclamation": 1, "convenience_store": 1, "fire_extinguisher": 1, "construction_site": 1, "arrow_upper_right": 1, "heart_eyes_monkey": 1, 
	"mailbox_with_mail": 1, "incoming_envelope": 1, "camera_with_flash": 1, "non_potable_water": 1, "manual_wheelchair": 1, "arrow_lower_right": 1, "lock_with_ink_pen": 1, "sunglasses_monkey": 1, "stuffed_flatbread": 1, 
	"arrow_double_down": 1, "bullettrain_front": 1, "star_and_crescent": 1, "last_quarter_moon": 1, "satellite_orbital": 1, "children_crossing": 1, "classical_building": 1, "white_small_square": 1, "first_quarter_moon": 1, 
	"arrow_heading_down": 1, "white_large_square": 1, "black_large_square": 1, "transgender_symbol": 1, "one_piece_swimsuit": 1, "mouse_three_button": 1, "small_blue_diamond": 1, "black_small_square": 1, "large_blue_diamond": 1, 
	"information_source": 1, "small_red_triangle": 1, "heavy_division_sign": 1, "black_square_button": 1, "white_square_button": 1, "waxing_gibbous_moon": 1, "kissing_closed_eyes": 1, "envelope_with_arrow": 1, "shallow_pan_of_food": 1, 
	"black_medium_square": 1, "waning_gibbous_moon": 1, "white_medium_square": 1, "ideograph_advantage": 1, "eye_in_speech_bubble": 1, "european_post_office": 1, "large_orange_diamond": 1, "closed_lock_with_key": 1, "small_orange_diamond": 1, 
	"waning_crescent_moon": 1, "flower_playing_cards": 1, "globe_with_meridians": 1, "martial_arts_uniform": 1, "motorized_wheelchair": 1, "kissing_smiling_eyes": 1, "mailbox_with_no_mail": 1, "waxing_crescent_moon": 1, "fishing_pole_and_fish": 1, 
	"part_alternation_mark": 1, "ballot_box_with_check": 1, "eight_spoked_asterisk": 1, "disappointed_relieved": 1, "face_with_spiral_eyes": 1, "vertical_traffic_light": 1, "heavy_multiplication_x": 1, "sunrise_over_mountains": 1, "running_shirt_with_sash": 1, 
	"small_red_triangle_down": 1, "put_litter_in_its_place": 1, "chart_with_upwards_trend": 1, "face_with_raised_eyebrow": 1, "eight_pointed_black_star": 1, "leftwards_arrow_with_hook": 1, "black_medium_small_square": 1, "white_medium_small_square": 1, "face_with_hand_over_mouth": 1, 
	"twisted_rightwards_arrows": 1, "smiling_face_with_3_hearts": 1, "chart_with_downwards_trend": 1, "negative_squared_cross_mark": 1, "stuck_out_tounge_winking_eye": 1, "face_with_symbols_over_mouth": 1, "notebook_with_decorative_cover": 1, "diamond_shape_with_a_dot_inside": 1
}

function Init(final) {
    Discord = { window: (typeof(unsafeWindow) !== 'undefined') ? unsafeWindow : window };

    const webpackUtil = Utils.Webpack();
    if(webpackUtil == null) { if(final) Utils.Error("Webpack not found."); return 0; }
    const { findModule, findModuleByUniqueProperties } = webpackUtil;

    let emojisModule = findModuleByUniqueProperties([ 'getDisambiguatedEmojiContext', 'searchWithoutFetchingLatest' ]);
    if(emojisModule == null) { if(final) Utils.Error("emojisModule not found."); return 0; }

    let messageEmojiParserModule = findModuleByUniqueProperties([ 'parse', 'parsePreprocessor', 'unparse' ]);
    if(messageEmojiParserModule == null) { if(final) Utils.Error("messageEmojiParserModule not found."); return 0; }

    let emojiPickerModule = findModuleByUniqueProperties([ 'useEmojiSelectHandler' ]);
    if(emojiPickerModule == null) { if(final) Utils.Error("emojiPickerModule not found."); return 0; }

    const original_searchWithoutFetchingLatest = emojisModule.searchWithoutFetchingLatest;
    emojisModule.searchWithoutFetchingLatest = function() {
        let result = original_searchWithoutFetchingLatest.apply(this, arguments);
        result.unlocked.push(...result.locked);
        result.locked = [];
        return result;
    }

    const original_parse = messageEmojiParserModule.parse;
    messageEmojiParserModule.parse = function() {
        let result = original_parse.apply(this, arguments);

        let validNonShortcutEmojis = result.validNonShortcutEmojis;
        for (let i = 0; i < validNonShortcutEmojis.length; i++) {
            const emoji = validNonShortcutEmojis[i];

            if (emojis[emoji.name] == 1) {
                result.content = result.content.replace(emoji.surrogates, "https://raw.github.com/0zBug/FluentEmoji/main/" + emoji.name + ".gif");
            }
        }

        return result
    };

    const original_useEmojiSelectHandler = emojiPickerModule.useEmojiSelectHandler;
    emojiPickerModule.useEmojiSelectHandler = function(args) {
		const { onSelectEmoji, closePopout } = args;
		const originalHandler = original_useEmojiSelectHandler.apply(this, arguments);
		return function(data, state) {
			if(state.toggleFavorite)
				return originalHandler.apply(this, arguments);

			const emoji = data.emoji;
			if(emoji != null) {
				onSelectEmoji(emoji, state.isFinalSelection);
				if(state.isFinalSelection) closePopout();
			}
		};
    };

    Utils.Log("loaded");

    return 1;
}


var InitFails = 0;
function TryInit()
{
    if(Init() !== 0) return;

    window.setTimeout((++InitFails === 600) ? Init : TryInit, 100, true);
};


TryInit();

})();
