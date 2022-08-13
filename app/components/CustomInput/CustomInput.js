import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import reactDom from 'react-dom';

const CustomInput = ({onPress, control, name, rules = {}, placeholder, secure, newValue, numeric}) => {
    return (
        
            <Controller 
                control={control}
                name={name}
                rules={rules}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => 
                <>
                    <View style={ [styles.container, {borderColor: error ? 'red' : '#E8E8E8'}] }>
                        <TextInput 
                            onPressIn={onPress}
                            keyboardType={numeric ? 'number-pad' : 'default'}
                            value={newValue === undefined ? value : newValue} 
                            onChangeText={onChange} 
                            onBlur={onBlur} 
                            placeholder={ placeholder }
                            style={ [styles.input, {}] } 
                            secureTextEntry={secure}
                        />
                    </View>
                    { error && (<Text style={{color: 'red', alignSelf: 'stretch'}}>{ error.message || 'Error'}</Text>)}
                </>
                }
            />

        
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 40,

        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 5
    },
    input: {
        height: 40,
    },
})

export default CustomInput;