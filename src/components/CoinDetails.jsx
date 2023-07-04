import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  HStack,
  RadioGroup,
  Radio,
  VStack,
  Text,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Progress,
  Button,
} from "@chakra-ui/react";
import Loader from "./Loader";
import { server } from "../index";
import ErrorComponent from "./ErrorComponent";
import { useParams } from "react-router-dom";
import axios from "axios";
import Chart from "./Chart";

const CoinDetails = () => {
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);
  const params = useParams();
  
  const currencySymbol =
  currency === "inr" ? "₹" : currency === "usd" ? "$" : "€";

  const btns = ['24h','7d','14d','30d','60d','200d','365d','max'];

  const switchChartStats = (key)=>{
      switch (key) {
        case '24h':
          setDays('24h');
          setLoading(true);
          break;
        case '7d':
          setDays('7d');
          setLoading(true);
          break;
        case '14d':
          setDays('14d');
          setLoading(true);
          break;
        case '30d':
          setDays('30d');
          setLoading(true);
          break;
        case '60d':
          setDays('60d');
          setLoading(true);
          break;
        case '200d':
          setDays('200d');
          setLoading(true);
          break;
        case '1y':
          setDays('365d');
          setLoading(true);
          break;
        case 'max':
          setDays('max');
          setLoading(true);
          break;
        default:
          break;
      }
  }
  
  
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);

        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        // console.log(data);
        setCoin(data);
        setChartArray(chartData.prices);
        // console.log(chartData)
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [params.id,currency,days]);

  if (error)
    return <ErrorComponent message={"Error While Fetching Coin details"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box borderWidth={"1"} width={"full"}>
            <Chart arr={chartArray} currency={currency} />
          </Box>

          <HStack p={'4'} wrap={'wrap'} overflowX={'auto'}>
            {btns.map((i)=>{
               return  <Button style={{}} key={i} onClick={()=>switchChartStats(i)}>{i}</Button>
            })}
          </HStack>

          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value="inr">INR</Radio>
              <Radio value="usd">USD</Radio>
              <Radio value="eur">EUR</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={0.7}>
              Last Updated On{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>

            <Image
              src={coin.image.large}
              h={"16"}
              w={"16"}
              objectFit={"contain"}
            />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol} {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.market_cap_change_percentage_24h >= 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.market_cap_change_percentage_24h}
              </StatHelpText>
            </Stat>

            <Badge fontSize={"2xl"} bgColor={"blackAlpha.300"} color={"white"}>
              {`#${coin.market_cap_rank}`}
            </Badge>

            <CustomBar
              high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
            />

            <Box w={"full"} p={"4"}>
              <Item
                title={"Max Supply"}
                value={
                  coin.market_data.max_supply
                    ? coin.market_data.max_supply
                    : "NA"
                }
              />
              <Item
                title={"Circulating Supply"}
                value={
                  coin.market_data.circulating_supply
                    ? coin.market_data.circulating_supply
                    : "NA"
                }
              />
              <Item
                title={"Market Cap"}
                value={
                  coin.market_data.market_cap[currency]
                    ? `${currencySymbol}${coin.market_data.market_cap[currency]}`
                    : "NA"
                }
              />
              <Item
                title={"All Time Low"}
                value={
                  coin.market_data.atl
                    ? `${currencySymbol}${coin.market_data.atl[currency]}`
                    : "NA"
                }
              />
              <Item
                title={"All Time High"}
                value={
                  coin.market_data.ath
                    ? `${currencySymbol}${coin.market_data.ath[currency]}`
                    : "NA"
                }
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"sans-serif"} fontWeight={"700"} letterSpacing={"widest"}>
      {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
);

const CustomBar = ({ high, low }) => {
  return (
    <VStack w={"full"}>
      <Progress value={50} colorScheme="teal" w={"full"} />
      <HStack justifyContent={"space-between"} w={"full"}>
        <Badge children={low} colorScheme="red" />
        <Text fontSize={"sm"}>24H Range</Text>
        <Badge children={high} colorScheme="green" />
      </HStack>
    </VStack>
  );
};

export default CoinDetails;
