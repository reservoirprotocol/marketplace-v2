import { styled } from "../../stitches.config";
import Flex from "./Flex";
import Box from "./Box";
import Text from "./Text";

const Value = ({ type, value, size = 11, fontSize = 16 }: any) => (
  <Flex align="center">
    <img
      style={{ width: size }}
      src={type == "weth" ? "/weth.png" : "/eth.png"}
    />
    {false && <Text css={{ fontFamily: "arial" }}>Ξ</Text>}
    <Text style="subtitle1" css={{ marginLeft: "$1", fontSize }}>
      {value || "---"}
    </Text>
  </Flex>
);

export default Value;
