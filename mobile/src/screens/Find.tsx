import { Heading, useToast, VStack } from 'native-base';
import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function Find(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');
    const { navigate } = useNavigation();
    const toast = useToast();

    async function handleJoinPool() {
        try {
            setIsLoading(true);

            if (!code.trim()) {
                toast.show({
                    title: 'Informe o código!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            const { title } = (await api.post('/pools/join', { code })).data;

            toast.show({
                title: `Você entrou no bolão: ${title}.`,
                placement: 'top',
                bgColor: 'green.500'
            });

            navigate('pools');

        } catch (err) {
            console.log(err);
            setIsLoading(false);

            if (err.response?.data?.message === "Pool not found.") {
                toast.show({
                    title: 'Bolão não encontrado!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            if (err.response?.data?.message === "You already joined this pool.") {
                toast.show({
                    title: 'Você já entrou nesse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            toast.show({
                title: 'Não foi possível encontrar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    useFocusEffect(useCallback(() => {
        setIsLoading(false);
        setCode('');
    }, []))

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Encontre um bolão através de{'\n'}seu código único
                </Heading>

                <Input mb={2} placeholder="Qual o código do seu bolão?"
                    autoCapitalize='characters'
                    onChangeText={setCode} />

                <Button title='Buscar bolão'
                    isLoading={isLoading}
                    onPress={handleJoinPool} />
            </VStack>
        </VStack>
    );
}

export default Find;