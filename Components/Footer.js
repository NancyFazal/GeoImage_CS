import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
const Footer = props =>{
const [isChangingRadius, setIsChangingRadius] = useState(false);
const [radius, setRadius] = useState(100);
const [generateTargets, setGenerateTargets] = useState(false);
const changeRadiusHandler = () =>{
    setIsChangingRadius(true);
};
const onFinishRadiusEdit = () =>{
    setIsChangingRadius(false);
    setGenerateTargets(true);
}
const onGenerateTargets = () =>{
    return;
}
const displayFooter = () =>{
    if(isChangingRadius == false && generateTargets == false){
        return (<View>
            <Button title="Reset Radius" onPress={changeRadiusHandler}/>
        </View>)
    }else if (isChangingRadius == true){
        return (<View style={styles.buttonContainer}>
            <Button title="Increase" onPress={()=>setRadius(radius+5)}/>
            <Button title= "Ok" onPress={onFinishRadiusEdit}/>
            <Button title="decrease" onPress={()=>setRadius(radius-5)}/>
        </View>)
    }
    else{
        return (<View>
            <Button title="Generate Targets" onPress={onGenerateTargets}/>
        </View>)
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
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly'
    }
});
export default Footer;