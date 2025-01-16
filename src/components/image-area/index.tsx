const ImageArea = (props: any) => {
  return (
    <img
      w="100%"
      h="100%"
      src={`https://picsum.photos/200/300?id=${Math.random()}`}
      objectFit="cover"
      alt=""
      {...props}
    />
  );
};

export default ImageArea;
