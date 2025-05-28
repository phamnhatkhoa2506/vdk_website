interface Threshold {
    gas_threshold: number,
    humidity_threshold: number,
    temperature_threshold: number
}

interface DangerData {
    gas: boolean,
    humidity: boolean,
    temp: boolean
}