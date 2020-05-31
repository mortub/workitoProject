import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { recoveryDaysSeniorityTable } from '../RecoveryDaysSeniorityTable';
import firestore from '@react-native-firebase/firestore';
import { Styles } from '../theme/Styles';
import { validateName } from '../Validation';

//a form of the recovery days calculation
const RecoveryDaysForm = () => {
    const [submit, setSubmit ] = useState(false);
    const [values, setValues] = useState({
        //the final calculation of the recovery days
        recoveryDaysPayment: '',
        //the worker's first name given from the user
        firstName: '',
        //the worker's last name given from the user
        lastName: '',
        //the seniority given from the user
        seniority: '',
        //the hours per week given from the user
        hoursPerWeek: '',
    });
    //the error to show for the first name
    const [errorFirstName, setErrorFirstName] = useState('');
    //the error to show for the last name
    const [errorLastName, setErrorLastName] = useState('');
    //the error to show for the seniority
    const [errorSeniority, setErrorSeniority] = useState('');
    //the error to show for the hours per week
    const [errorHoursPerWeek, setErrorHoursPerWeek] = useState('');
    //the current Recovery Days Payment for one day in shekels
    const currentRecoveryDaysPayment = 378;
    //the current number of hours per week to work at a full-time job
    const divider = 42;

    //validates the first name
    const validateFirstName = (val)=>{  
        setValues({...values,firstName:val}); 
        if (validateName(val) === false) {          
            setErrorFirstName('please provide a valid name')
            return false;
        } else {
            return true;
        }
    }
     //validates the last name
     const validateLastName = (val)=>{ 
        setValues({...values, lastName:val});
        if (validateName(val) === false) {           
            setErrorLastName('please provide a valid name');
            return false;
        } else {
            return true;
        }
    }
    //validates the seniority - positive integer
    const validateSeniority = (val) => {   
        setValues({...values, seniority:val});    
        let reg = /^\d+$/;       
        if (val === '' || reg.test(val) === false) {          
            setErrorSeniority('please provide a positive integer');
            return false;
        } else {
            return true;
        }

    }
    //validates the hours per week - positive float
    const validateHoursPerWeek = (val) => {
        setValues({...values, hoursPerWeek:val});
        let reg = /^[+]?\d+([.]\d+)?$/
        if (val === '' || reg.test(val) === false) {          
            setErrorHoursPerWeek('please provide a number')
            return false;
        } else {
            return true;
        }
    }

    useEffect(()=>{
        if(submit === true){
            setSubmit(false);
            let f=validateFirstName(values.firstName);                            
            let l =validateLastName(values.lastName);
            let s= validateSeniority(values.seniority)
            let h=validateHoursPerWeek(values.hoursPerWeek);
 
            if(f && l && s && h){
                calculateRecoveryDays();
            }
        }

    });

    //calculation for th recovery days
    const calculateRecoveryDays = () => {
        let numberOfdaysAccordingToSeniority;
        if (Number.parseInt(values.seniority) > 20) {
            numberOfdaysAccordingToSeniority = recoveryDaysSeniorityTable['20'];
        } else {
            numberOfdaysAccordingToSeniority = recoveryDaysSeniorityTable[values.seniority];
        }
        //(number of recovery days according to seniority * hours per week * currentRecoveryDaysPayment)/divider
        const cal = ((numberOfdaysAccordingToSeniority * Number.parseFloat(values.hoursPerWeek) * currentRecoveryDaysPayment) / divider).toFixed(3);       
        setValues({...values, recoveryDaysPayment: `The recovery days payment is: ${cal}` + '\nNew Shekels'});
        //adding a new worker for every correct form submmitted
        firestore().collection('workers').add({
            firstname: values.firstName,
            lastName: values.lastName,
            seniority: values.seniority,
            hoursPerWeek: values.hoursPerWeek,
            recoveryDaysPayment: cal,
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });


    }

    return (
        <ScrollView style = {Styles.view}>
            <Text style={Styles.text}>Calculating Recovery Days Payment</Text>
            <View>
            <TextInput
                    label="Worker's first name"
                    placeholder="Worker's first name"
                    keyboardType='default'
                    onChangeText={val => {   
                        setErrorFirstName('');
                        validateFirstName(val);
                        setValues({...values, firstName:val});                        
                    }}
                    value={values.firstName}
                />
                <HelperText
                    type="error"
                >
                    {errorFirstName}
                </HelperText>
                <TextInput
                    label="Worker's last name"
                    placeholder="Worker's last name"
                    keyboardType='default'
                    onChangeText={val => {   
                        setErrorLastName('');                   
                        validateLastName(val);
                        setValues({...values, lastName:val});                       
                    }}
                    value={values.lastName}
                />
                <HelperText
                    type="error"
                >
                    {errorLastName}
                </HelperText>
                <TextInput
                    label="Seniority"
                    placeholder="Seniority"
                    keyboardType='default'
                    onChangeText={val => {   
                        setErrorSeniority('');                                                                                                     
                        validateSeniority(val);
                        setValues({...values, seniority:val});                       
                    }}
                    value={values.seniority}
                />
                <HelperText
                    type="error"
                >
                    {errorSeniority}
                </HelperText>
                <TextInput
                    label="Number of hours per week"
                    placeholder="Number of hours per week"
                    keyboardType='default'
                    onChangeText={val => {
                        setErrorHoursPerWeek('');                                           
                        validateHoursPerWeek(val);
                        setValues({...values, hoursPerWeek:val});                       
                    }}
                    value={values.hoursPerWeek}
                />
                <HelperText
                    type="error"
                >
                    {errorHoursPerWeek}
                </HelperText>
                <Button color={Styles.color} title='Calculate' 
                onPress={()=> {                 
                    setSubmit(true);
                }}></Button>
                <Text style={Styles.text}>{values.recoveryDaysPayment}</Text>
            </View>
            <View>
                    <Text style={{paddingTop: 500}}>
                    </Text>
            </View>
        </ScrollView>
    )
};

export default RecoveryDaysForm;