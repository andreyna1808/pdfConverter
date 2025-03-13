import * as Elements from "./styles";
import Layout from "../../components/Layout";
import { AvailableServices } from "../../utils/availableServices";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Elements.Container>
        <Elements.Tittle>Ferramentas disponíveis</Elements.Tittle>

        <Elements.ContainerServices>
          {AvailableServices.map((service) => (
            <Elements.Service
              key={service.name}
              className="service-item"
              onClick={() => navigate(`/${service.urlReq}`)}
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
