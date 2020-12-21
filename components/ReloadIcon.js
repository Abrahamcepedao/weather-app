import React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import {colors} from '../utils/index';

export default function ReloadIcon({load}) {
    const refreshIcon = Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh';
    return (
        <View style={styles.reloadIcon}>
            <Ionicons onPress={load} name={refreshIcon} size={24} color="black"/>
        </View>
    )
}

const styles = StyleSheet.create({
    reloadIcon: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 40
            },
            android: {
                top: 30
            },
        }),
        right: 30,
        color: colors.PRIMARY_COLOR
    }
})