import React from "react";
import { Text, View } from "react-native";
import { colors, fontFamily, fontSize, spaceVertical } from "../styles/variables";

export const Label = ({styles, label, superscript, laterText, type} : any) => {

    return(
            <>
            
            <Text style={{
                fontFamily:fontFamily.semiBold,
                marginBottom:spaceVertical.XXS - 8,
                color:colors.black,
                ...styles,}}>{label}</Text> 
             
            </>

            
        
    )
}