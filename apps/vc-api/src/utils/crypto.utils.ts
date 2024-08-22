import { TypedArrayEncoder } from "@credo-ts/core"

export const Base64ToBase58 = (base64: string) : string => {
    return TypedArrayEncoder.toBase58(
        TypedArrayEncoder.fromBase64(base64)
    );    
}