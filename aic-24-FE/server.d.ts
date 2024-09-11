type ApiError = {
  code: string;
  message: string;
};

type StaticProps = {
  locale: string;
  params: {
    id?: string;
  };
};
