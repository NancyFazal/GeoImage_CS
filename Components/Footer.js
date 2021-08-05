import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
const Footer = props =>{
const displayFooter = () =>{
    if (props.Targets == true) {
        return (<View>
            <TextInput
                value={props.numberOfTargets}
                onChangeText={props.setNumTargets}
                placeholder={'No. of Targets'}
                style={styles.input}
            />
            <Button title="Generate Targets" onPress={props.osmTargets} />
        </View>)
    }
    else {
        return (
            <View>
                <Button title="Play" />
            </View>
        )
    }
}
    return (
        <View style={styles.footer}>
        {displayFooter()}     
        </View>
    );
}
const styles = StyleSheet.create({
    footer:{
        width: '100%',
        height: 70,
        backgroundColor:'#FF7F50',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default Footer;