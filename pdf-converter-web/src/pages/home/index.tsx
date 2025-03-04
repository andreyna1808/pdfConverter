import { Helmet } from "react-helmet";
import * as Elements from "./styles";
import Layout from "../../components/Layout";
import { AvailableServices } from "../../utils/availableServices";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Helmet>
        <meta
          name="description"
          content="Sobre Andreyna Carvalho e o motivo do desenvolvimento do projeto."
        />
        <title>Página inicial</title>
      </Helmet>

      <Elements.Container>
        <Elements.Tittle>Ferramentas disponiveis</Elements.Tittle>

        <Elements.ContainerServices>
          {AvailableServices.map((service) => (
            <Elements.Service
              key={service.name}
              className="service-item"
              onClick={() => navigate(`/${service.name}`)}
            >
              <Elements.NameService>{service.name}</Elements.NameService>
              <Elements.BodyService>{service.description}</Elements.BodyService>
            </Elements.Service>
          ))}
        </Elements.ContainerServices>
      </Elements.Container>
    </Layout>
  );
};

export default Home;
