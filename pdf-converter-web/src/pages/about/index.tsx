import * as Elements from "./styles";
import Layout from "../../components/Layout";

const About = () => {
  return (
    <Layout>
      <Elements.Container>
        <Elements.Title>Sobre o Projeto</Elements.Title>
        <Elements.Description>
          Este é um projeto em desenvolvimento com o objetivo de auxiliar a vida
          dos estudantes e concurseiros
        </Elements.Description>

        <Elements.ProfileSection>
          <Elements.ProfileImage
            src={"https://avatars.githubusercontent.com/u/87716793?v=4"}
            alt="Andreyna Carvalho"
          />
          <Elements.Name>Andreyna Carvalho</Elements.Name>
          <Elements.LinksContainer>
            <Elements.Button
              href="https://www.linkedin.com/in/andreyna-carvalho-997273231/"
              target="_blank"
            >
              LinkedIn
            </Elements.Button>
            <Elements.Button
              href="https://github.com/andreyna1808"
              target="_blank"
            >
              GitHub
            </Elements.Button>
          </Elements.LinksContainer>
          <Elements.CodeInfo
            src={
              "https://github-readme-stats.vercel.app/api/top-langs/?username=andreyna1808&layout=compact&theme=gruvbox"
            }
            alt="Andreyna Languages"
          />
          <Elements.ContactEmail>
            andreyna.m.carvalho@gmail.com
          </Elements.ContactEmail>
        </Elements.ProfileSection>
      </Elements.Container>
    </Layout>
  );
};

export default About;
