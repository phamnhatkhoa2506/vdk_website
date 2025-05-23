import { database } from './firebase';
import { ref, set, get, onValue } from 'firebase/database';

export async function getSensorDataByDate(date: string) {
    const dbRef = ref(database, `sensors/${date}`);
    const snapshot = await get(dbRef);
    return snapshot.exists() ? snapshot.val() : null;
}

export async function getSensorDataByDateAndHour(date: string, hour: string) {
    const dbRef = ref(database, `sensors/${date}`);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) return null;

    const allData = snapshot.val();

    const filtered = Object.entries(allData).filter(([time, _]) => {
        return time.startsWith(`${hour.padStart(2, '0')}:`);
    });

    const result = Object.fromEntries(filtered);

    return result;
}
