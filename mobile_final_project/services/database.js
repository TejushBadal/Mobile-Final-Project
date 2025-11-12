import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'lost_pets_db';

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('Lost', 'Found')) NOT NULL,
        species TEXT CHECK(species IN ('Dog', 'Cat')) NOT NULL,
        breed TEXT NOT NULL,
        color TEXT NOT NULL,
        last_seen DATETIME NOT NULL,
        location TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        description TEXT,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        image_uri TEXT,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await seedInitialData();

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const seedInitialData = async () => {
  try {
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM pets');

    if (result.count === 0) {
      const demoData = [
        {
          name: 'Buddy',
          type: 'Lost',
          species: 'Dog',
          breed: 'Pomeranian',
          color: 'Orange and White',
          last_seen: '2025-11-01T14:30:00',
          location: 'High Park, Toronto',
          latitude: 43.6465,
          longitude: -79.4637,
          description: 'Very friendly small dog, answers to Buddy. Has a small scar on left ear.',
          contact_name: 'John Doe',
          contact_email: 'john.doe@email.com',
          contact_phone: '(416) 555-0123',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'demo_user'
        },
        {
          name: 'Whiskers',
          type: 'Found',
          species: 'Cat',
          breed: 'Maine Coon',
          color: 'Gray and White',
          last_seen: '2025-10-30T09:15:00',
          location: 'Distillery District, Toronto',
          latitude: 43.6503,
          longitude: -79.3592,
          description: 'Large fluffy cat with distinctive white chest marking. Found wandering, very friendly.',
          contact_name: 'Jane Smith',
          contact_email: 'jane.smith@email.com',
          contact_phone: '(416) 555-0456',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'demo_user_2'
        },
        {
          name: 'Charlie',
          type: 'Lost',
          species: 'Dog',
          breed: 'Golden Retriever',
          color: 'Golden',
          last_seen: '2025-11-02T16:45:00',
          location: 'Queen\'s Park, Toronto',
          latitude: 43.6596,
          longitude: -79.3925,
          description: 'Medium-sized golden retriever, very energetic and friendly.',
          contact_name: 'Mike Johnson',
          contact_email: 'mike.johnson@email.com',
          contact_phone: '(647) 555-0789',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'demo_user_3'
        },
        {
          name: 'Luna',
          type: 'Found',
          species: 'Cat',
          breed: 'Siamese',
          color: 'Cream and Brown',
          last_seen: '2025-10-29T20:00:00',
          location: 'Kensington Market, Toronto',
          latitude: 43.6542,
          longitude: -79.4006,
          description: 'Siamese cat with blue eyes, wearing a red collar. Found in good condition.',
          contact_name: 'Sarah Wilson',
          contact_email: 'sarah.wilson@email.com',
          contact_phone: '(416) 555-0321',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'demo_user_4'
        },
        {
          name: 'Max',
          type: 'Lost',
          species: 'Dog',
          breed: 'German Shepherd',
          color: 'Black and Tan',
          last_seen: '2025-11-01T11:20:00',
          location: 'Harbourfront, Toronto',
          latitude: 43.6426,
          longitude: -79.3780,
          description: 'Large German Shepherd, well-trained but may be scared.',
          contact_name: 'Robert Brown',
          contact_email: 'robert.brown@email.com',
          contact_phone: '(905) 555-0654',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'demo_user_5'
        },
        {
          name: 'Bella',
          species: 'Dog',
          breed: 'Labrador',
          color: 'Golden',
          type: 'Lost',
          last_seen: '2025-11-02T18:30:00',
          location: 'Scarborough, Toronto',
          latitude: 43.7731,
          longitude: -79.2578,
          description: 'Friendly golden lab, very social with people and other dogs.',
          contact_name: 'Jason M',
          contact_email: 'jayjay123@gmail.com',
          contact_phone: '+1 (555) 123-4567',
          image_uri: '@/assets/demo_images/ASSET_1.jpg',
          user_id: 'current_user'
        }
      ];

      for (const pet of demoData) {
        await db.runAsync(
          `INSERT INTO pets (
            name, type, species, breed, color, last_seen, location,
            latitude, longitude, description, contact_name, contact_email,
            contact_phone, image_uri, user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pet.name, pet.type, pet.species, pet.breed, pet.color, pet.last_seen,
            pet.location, pet.latitude, pet.longitude, pet.description,
            pet.contact_name, pet.contact_email, pet.contact_phone,
            pet.image_uri, pet.user_id
          ]
        );
      }

      console.log('Demo data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export const getAllPets = async () => {
  try {
    if (!db) {
      await initDatabase();
    }

    const pets = await db.getAllAsync(`
      SELECT
        id,
        name,
        type,
        species,
        breed,
        color,
        last_seen,
        location,
        latitude,
        longitude,
        description,
        contact_name,
        contact_email,
        contact_phone,
        image_uri,
        user_id,
        created_at,
        updated_at
      FROM pets
      ORDER BY created_at DESC
    `);

    return pets.map(pet => ({
      id: pet.id.toString(),
      name: pet.name,
      type: pet.type,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      lastSeen: pet.last_seen,
      location: pet.location,
      coordinates: {
        latitude: pet.latitude,
        longitude: pet.longitude
      },
      description: pet.description,
      contact: {
        name: pet.contact_name,
        email: pet.contact_email,
        phone: pet.contact_phone
      },
      imageUri: pet.image_uri,
      userId: pet.user_id,
      createdAt: pet.created_at,
      updatedAt: pet.updated_at
    }));
  } catch (error) {
    console.error('Error getting all pets:', error);
    return [];
  }
};

export const getPetsByUser = async (userId = 'current_user') => {
  try {
    if (!db) {
      await initDatabase();
    }

    const pets = await db.getAllAsync(`
      SELECT
        id,
        name,
        type,
        species,
        breed,
        color,
        last_seen,
        location,
        latitude,
        longitude,
        description,
        contact_name,
        contact_email,
        contact_phone,
        image_uri,
        user_id,
        created_at,
        updated_at
      FROM pets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    return pets.map(pet => ({
      id: pet.id.toString(),
      name: pet.name,
      type: pet.type,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      lastSeen: pet.last_seen,
      location: pet.location,
      coordinates: {
        latitude: pet.latitude,
        longitude: pet.longitude
      },
      description: pet.description,
      contact: {
        name: pet.contact_name,
        email: pet.contact_email,
        phone: pet.contact_phone
      },
      imageUri: pet.image_uri,
      userId: pet.user_id,
      createdAt: pet.created_at,
      updatedAt: pet.updated_at
    }));
  } catch (error) {
    console.error('Error getting user pets:', error);
    return [];
  }
};

export const addPet = async (petData) => {
  try {
    if (!db) {
      await initDatabase();
    }

    const result = await db.runAsync(
      `INSERT INTO pets (
        name, type, species, breed, color, last_seen, location,
        latitude, longitude, description, contact_name, contact_email,
        contact_phone, image_uri, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petData.name,
        petData.type,
        petData.species,
        petData.breed,
        petData.color,
        petData.lastSeen,
        petData.location,
        petData.coordinates.latitude,
        petData.coordinates.longitude,
        petData.description,
        petData.contact.name,
        petData.contact.email,
        petData.contact.phone,
        petData.imageUri,
        petData.userId || 'current_user'
      ]
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (petId, petData) => {
  try {
    if (!db) {
      await initDatabase();
    }

    await db.runAsync(
      `UPDATE pets SET
        name = ?, type = ?, species = ?, breed = ?, color = ?,
        last_seen = ?, location = ?, latitude = ?, longitude = ?,
        description = ?, contact_name = ?, contact_email = ?,
        contact_phone = ?, image_uri = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        petData.name,
        petData.type,
        petData.species,
        petData.breed,
        petData.color,
        petData.lastSeen,
        petData.location,
        petData.coordinates.latitude,
        petData.coordinates.longitude,
        petData.description,
        petData.contact.name,
        petData.contact.email,
        petData.contact.phone,
        petData.imageUri,
        petId
      ]
    );

    return true;
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
};

export const deletePet = async (petId) => {
  try {
    if (!db) {
      await initDatabase();
    }

    await db.runAsync('DELETE FROM pets WHERE id = ?', [petId]);
    return true;
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};

export const searchPets = async (searchQuery) => {
  try {
    if (!db) {
      await initDatabase();
    }

    const query = `%${searchQuery.toLowerCase()}%`;
    const pets = await db.getAllAsync(`
      SELECT
        id,
        name,
        type,
        species,
        breed,
        color,
        last_seen,
        location,
        latitude,
        longitude,
        description,
        contact_name,
        contact_email,
        contact_phone,
        image_uri,
        user_id,
        created_at,
        updated_at
      FROM pets
      WHERE
        LOWER(name) LIKE ? OR
        LOWER(species) LIKE ? OR
        LOWER(breed) LIKE ? OR
        LOWER(location) LIKE ? OR
        LOWER(type) LIKE ?
      ORDER BY created_at DESC
    `, [query, query, query, query, query]);

    return pets.map(pet => ({
      id: pet.id.toString(),
      name: pet.name,
      type: pet.type,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      lastSeen: pet.last_seen,
      location: pet.location,
      coordinates: {
        latitude: pet.latitude,
        longitude: pet.longitude
      },
      description: pet.description,
      contact: {
        name: pet.contact_name,
        email: pet.contact_email,
        phone: pet.contact_phone
      },
      imageUri: pet.image_uri,
      userId: pet.user_id,
      createdAt: pet.created_at,
      updatedAt: pet.updated_at
    }));
  } catch (error) {
    console.error('Error searching pets:', error);
    return [];
  }
};