import { database } from './firebase';
import { ref, set, get, update, DataSnapshot, onValue } from 'firebase/database';

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

export async function setMotor(value: boolean) {
    try {
        const motorRef = ref(database, 'control/motor');
        await set(motorRef, value);
        
        if (!value) {
            const dangerRef = ref(database, 'control/danger');
            const dangerSnap = await get(dangerRef);
            const dangerData = dangerSnap.val();

            if (dangerData) {
                const updates: Record<string, boolean> = {};

                for (const key in dangerData) {
                    if (dangerData[key] === true) {
                        updates[`control/danger/${key}`] = false;
                    }
                }

                if (Object.keys(updates).length > 0) {
                    await update(ref(database), updates);
                }
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}

export async function getMotorMode() {
    try {
        const dbRef = ref(database, 'control/motor');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const val = snapshot.val();
            console.log(val);

            return val ?? false;
        }

        return false;
    }
    catch (e) {
        console.log(e);

        return false;
    }
    
}

export function listenMotorMode(callback: (value: boolean) => void) {
    const dbRef = ref(database, 'control/motor');
    const unsubscribe = onValue(dbRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            const val = snapshot.val();
            callback(val);
        } else {
            callback(false);
        }
    });

    return unsubscribe; // có thể dùng để hủy listener sau này
}

export async function setBuzzer(value: boolean) {
    try {
        const dbRef = ref(database, 'control/buzzer');
        await set(dbRef, value);
        console.log("Doi thanh cong");
    }
    catch (e) {
        console.log(e)
    }
}

export function listenBuzzerMode(callback: (value: boolean) => void) {
    const dbRef = ref(database, 'control/buzzer');
    const unsubscribe = onValue(dbRef, snapshot => {
        if (snapshot.exists()) {
            const val = snapshot.val();
            callback(val);
        } else {
            callback(false);
        }
    });

    return unsubscribe; // có thể dùng để hủy listener sau này
}

export function listenToThreshold(callback: (thresholds: Threshold) => void) {
    const controlRef = ref(database, 'control');
    
    const unsubscribe = onValue(controlRef, snapshot => {
        const data = snapshot.val();

        const {
            gas_threshold = 1000,
            humidity_threshold = 80,
            temperature_threshold = 40,
        } = data || {};

        callback({ gas_threshold, humidity_threshold, temperature_threshold });
    });

    return unsubscribe;
}

export function listenToDanger(callback: (danger: DangerData) => void) {
    const dangerRef = ref(database, 'control/danger');

    const unsubscribe = onValue(dangerRef, snapshot => {
        const data = snapshot.val();
        const {
            gas = false,
            humidity = false,
            temp = false
        } = data || {};

        callback({ gas, humidity, temp });
    });

    return unsubscribe;
}
