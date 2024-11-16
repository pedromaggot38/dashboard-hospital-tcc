'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const generalTips = {
    introduction: "Explore informações gerais sobre o sistema, incluindo roles de usuários e permissões.",
    items: [
        {
            title: "O que são roles de usuário?",
            content: "Roles são papéis atribuídos aos usuários para determinar o nível de acesso e as permissões dentro do sistema. Eles ajudam a manter a organização e a segurança, limitando o que cada usuário pode fazer.",
        },
        {
            title: "Quais são os roles disponíveis?",
            content: "O sistema possui três roles principais: Root, Admin e Jornalista.",
        },
        {
            title: "Quais são as permissões do usuário Root?",
            content: "O usuário Root tem acesso total ao sistema. Ele pode criar, editar e excluir qualquer conteúdo, além de gerenciar notícias, usuários, médicos e configurações críticas.",
        },
        {
            title: "O que pode fazer um Admin?",
            content: "O Admin possui permissões para gerenciar usuários e conteúdo. Ele pode criar, editar e excluir usuários comuns, médicos e notícias, mas não tem permissão para criar usuários Root ou alterar o nível de acesso de um usuário para Root.",
        },
        {
            title: "Quais são as restrições do Jornalista?",
            content: "O Jornalista é limitado à criação e edição de notícias. Ele não pode gerenciar usuários, médicos ou acessar outras partes administrativas do sistema.",
        },
    ],
};

const newsTips = {
    introduction: "Aprenda como criar, editar e gerenciar notícias no sistema.",
    items: [
        {
            title: "Como criar uma nova notícia",
            content: "Para criar uma notícia, vá até a seção 'Notícias' no dashboard, clique no botão 'Nova Notícia' e preencha os campos obrigatórios como título, slug (gerado automaticamente) e autor. Não se esqueça de definir o status como 'Publicado' para torná-la visível no site.",
        },
        {
            title: "Posso editar uma notícia já publicada?",
            content: "Sim. Navegue até a lista de notícias, clique no botão de opções ao lado da notícia desejada e selecione 'Editar Notícia', faça as alterações necessárias e salve. As alterações serão refletidas imediatamente.",
        },
        {
            title: "É possível deixar uma noticia como rascunho?",
            content: "Sim, basta alterar o status da noticia de 'Publicado'para 'Rascunho' e ela ficará disponível apenas no Dashboard.",
        },
        {
            title: "É obrigatório adicionar foto para a capa da noticia?",
            content: "Não é obrigatório adicionar uma foto para a capa da noticia.",
        },
        {
            title: "Como adicionar uma foto para a capa da noticia?",
            content: "Na aba de detalhes de notícia, clique em 'Definir Capa da Notícia' e selecione uma foto e confirme no botão da aba, será preenchido automaticamente o campo 'Capa da Notícia' com a URL da imagem.",
        },
        {
            title: "É possível adicionar o link de uma foto da internet, para a capa da noticia?",
            content: "Sim, basta adicionar o link da imagem diretamente no campo 'Capa da Noticia'. Não é necessário acessar a opção de 'Definir Capa da Noticia'.",
        },
        {
            title: "O que é o campo 'Slug'?",
            content: "O slug é uma parte única da URL que identifica a página de forma amigável e legível. Ele é gerado a partir do título do conteúdo e geralmente é escrito em letras minúsculas, sem espaços ou caracteres especiais, substituídos por hifens (-). Por exemplo, um título como 'O que é um slug?' resultaria no slug o-que-e-um-slug.",
        },
        {
            title: "O que fazer se o slug da notícia já estiver em uso?",
            content: "O slug deve ser único para cada notícia. Altere o título ou edite manualmente o slug para garantir que ele seja único.",
        },
        {
            title: "O que é o campo 'Descrição da Imagem'?",
            content: "O campo serve para preencher o atributo 'alt' no componente de imagem, garantindo acessibilidade ao descrever o conteúdo para leitores de tela, atuando como fallback caso a imagem não carregue e contribuindo para o SEO ao ajudar mecanismos de busca a entenderem o contexto da imagem.",
        },
    ],
};

const userTips = {
    introduction: "Descubra como gerenciar os usuários no sistema, incluindo redefinição de senha e atribuição de roles.",
    items: [
        {
            title: "Como adicionar um novo usuário ao sistema?",
            content: "Na seção 'Usuários', clique em 'Criar Usuário', preencha as informações obrigatórias marcadas com * e clique em 'Criar'.",
        },
        {
            title: "Por que é importante atribuir roles de usuário?",
            content: "Atribuir roles para usuários pode ajudar a manter a organização e a segurança. Eles ajudam a manter o acesso ao sistema, limitando o que cada um pode fazer.",
        },
        {
            title: "Como atribuir roles de usuário?",
            content: "No campo 'Roles', selecione a role desejada e clique em 'Salvar'.",
        },
        {
            title: "Criação de usuários Root",
            content: "Para criar ou alterar o nível de acesso de um usuário para Root, é obrigatório ser do mesmo cargo.",
        },
        {
            title: "Informações adicionais sobre 'Root'",
            content: "Permissões adicionais: alteração manual de senhas de qualquer usuário e visualização dos tokens de redefinição. Criar, editar e excluir notícias, médicos, usuário (não é possível excluir).",
        },
        {
            title: "Informações adicionais sobre 'Admin'",
            content: "Não possui permissão de criar usuários 'Root' ou alterar contas para 'Root'. Permissões: criar, editar e excluir notícias, médicos, usuário (não é possível excluir, editar ou gerenciar qualquer permissão relacionada ao 'Root')."
        },
        {
            title: "Informações adicionais sobre 'Jornalista'",
            content: "O Jornalista é limitado à criação e edição de notícias. Ele não pode gerenciar usuários, médicos ou apagar notícias, mas pode deixá-las como rascunho.",
        },
        {
            title: "Por que não é possível excluir usuários?",
            content: "Para preservarmos a integridade do sistema, não é permitido excluir usuários, pois todos podem estar relacionados com a criação de alguma notícia ou médico.",
        },
        {
            title: "Como redefinir a senha de um usuário?",
            content: "Ao acessar as configurações do usuário, clique em 'Segurança' e preencha os campos com os dados.",
        },
        {
            title: "Posso redefinir a senha de outro usuário?",
            content: "Apenas usuários 'Root' possuem permissão para redefinir a senha de outros usuários.",
        },
        {
            title: "Para que serve o Token?",
            content: "O token serve para redefinir a senha de um usuário em caso de perda de acesso. Ele deverá ser salvo pelo dono da conta em um local seguro e ele pode ser utilizado para redefinir a senha junto com seu username na tela de login.",
        },
        {
            title: "Posso desativar um usuário?",
            content: "Sim, mas apenas usuários 'Root' e 'Admin' podem fazer a desativação de contas. Na edição de um usuário, altere o status do campo Bloqueado. Ele não poderá mais acessar o sistema.",
        },
    ],
};

const doctorTips = {
    introduction: "Saiba como adicionar, editar e gerenciar médicos no sistema.",
    items: [
        {
            title: "Como cadastrar um médico no sistema?",
            content: "Acesse a seção 'Médicos', clique em 'Novo Médico' e preencha os dados obrigatórios, como nome, especialidade, CRM e ao menos um horário de atendimento.",
        },
        {
            title: "Posso atribuir horários de atendimento aos médicos?",
            content: "Sim. Durante o cadastro ou edição de um médico, você pode adicionar horários de atendimento específicos para cada dia da semana.",
        },
        {
            title: "Como remover um médico do sistema?",
            content: "Na lista de médicos, clique no botão de opções do médico e clique em 'Remover' (disponível somente para usuários 'Root' e 'Admin'). Confirme a exclusão na janela de confirmação.",
        },
        {
            title: "É possível fazer com que o médico não apareça na lista do site?",
            content: "Sim, basta alterar o status do médico de 'Ativo' para 'Inativo'. Ele ficará disponível apenas no Dashboard.",
        },
        {
            title: "Posso editar os horários de atendimento de um médico?",
            content: "Sim, basta clicar no botão de opções do médico e editar os horários de atendimento.",
        },
        {
            title: "Para que serve o CRM?",
            content: "O CRM é um identificador único, que serve para distinguir o médico dentro do sistema e fora dele.",
        },
        {
            title: "Posso editar a especialidade de um médico?",
            content: "Sim, acessse o a área de edição do médico e preencher a especialidade.",
        },
    ],
};

const sections = [
    { title: "Dicas Gerais", data: generalTips },
    { title: "Dicas sobre Notícias", data: newsTips },
    { title: "Dicas sobre Usuários", data: userTips },
    { title: "Dicas sobre Médicos", data: doctorTips },
];

const HelpPage = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl px-4">
                <h1 className="text-3xl font-semibold pb-6">Ajuda</h1>

                <Accordion type="single" collapsible>
                    {sections.map((section, sectionIndex) => (
                        <AccordionItem
                            key={`section-${sectionIndex}`}
                            value={`section-${sectionIndex}`}
                        >
                            <AccordionTrigger>{section.title}</AccordionTrigger>
                            <AccordionContent className="pl-6">
                                <p className="mb-4 text-gray-500">{section.data.introduction}</p>
                                <Accordion type="single" collapsible>
                                    {section.data.items.map((item, itemIndex) => (
                                        <AccordionItem
                                            key={`item-${sectionIndex}-${itemIndex}`}
                                            value={`item-${sectionIndex}-${itemIndex}`}
                                        >
                                            <AccordionTrigger>{item.title}</AccordionTrigger>
                                            <AccordionContent className="pl-4">{item.content}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default HelpPage;