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
          name="home"
          content="Página inicial com todos os serviços disponiveis, 
          Merge PDF, Mesclar múltiplos PDFs em um único arquivo, Remove Pages, 
          Remover páginas específicas de um PDF, Compress PDF, Reduzir o tamanho do arquivo PDF, 
          PDF to JPG, Converter um PDF para imagens JPG, PDF to WORD, Converter um PDF para documento 
          editável do Word, JPG to PDF, Converter imagens JPG para PDF, Formatar word padrão ABNT, 
          Classificação de provas"
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
