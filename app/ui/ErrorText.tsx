import React from "react";
import { Text } from "react-native";
import { colors, fontFamily, fontSize } from "../styles/variables";

export const ErrorText = ({error, style} : any) => {

    return(
    <Text style={{
        fontFamily:fontFamily.regular,
        color:colors.red,
        textAlign:"center",
        marginTop:5,
        ...style
    }}>{error}</Text>
    )
}