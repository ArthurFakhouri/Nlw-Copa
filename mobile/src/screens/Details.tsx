import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { Share } from 'react-native';
import { useEffect, useState } from 'react';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { api } from '../services/api';
import { Guesses } from '../components/Guesses';

interface RouteParams {
    id: string;
    title: string;
}

function Details(props) {

    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
    const route = useRoute();
    const { id, title } = route.params as RouteParams;
    const toast = useToast();

    async function fetchPoolDetails() {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
        } catch (err) {
            console.log(err);

            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id])

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={title} showBackButton showShareButton
                onShare={handleCodeShare} />

            {
                poolDetails._count?.participants > 0 ?
                    <VStack flex={1} px={5}>
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option title='Seus palpites' isSelected={optionSelected === 'guesses'}
                                onPress={() => setOptionSelected('guesses')} />
                            <Option title='Ranking do grupo' isSelected={optionSelected === 'ranking'}
                                onPress={() => setOptionSelected('ranking')} />
                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                    </VStack>
                    :
                    <EmptyMyPoolList code={poolDetails.code} />
            }

        </VStack>
    );
}

export default Details;