import {
  render,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlTextProps,
  MjmlDivider
} from 'mjml-react';
import { NextPage, GetServerSideProps } from 'next';
import { CSSProperties } from 'react';
import { theme } from 'styles/theme';

function CSSPropsToMjmlTextProps(cssprops: CSSProperties): MjmlTextProps {
  return {
    fontSize: cssprops.fontSize as string,
    fontWeight: cssprops.fontWeight as number,
    fontFamily: cssprops.fontFamily
  };
}

const h1Props = CSSPropsToMjmlTextProps(theme.typography.h1);
const h2Props = CSSPropsToMjmlTextProps(theme.typography.h2);
const h3Props = CSSPropsToMjmlTextProps(theme.typography.h3);
const h4Props = CSSPropsToMjmlTextProps(theme.typography.h4);
const h5Props = CSSPropsToMjmlTextProps(theme.typography.h5);
const h6Props = CSSPropsToMjmlTextProps(theme.typography.h6);
const body1Props = CSSPropsToMjmlTextProps(theme.typography.body1);

type EmailTemplateProps = {
  itemName: string;
  message: string;
};
const EmailTemplate = ({ message, itemName }: EmailTemplateProps) => {
  const tagline = `[${itemName}] Somebody sent a one-way message`;
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{tagline}</MjmlTitle>
        <MjmlPreview>{tagline}</MjmlPreview>
      </MjmlHead>
      <MjmlBody width={500} backgroundColor="#E9F2F0">
        <MjmlColumn>
          <MjmlSection backgroundColor="#ffffff" padding="1rem">
            <MjmlSection>
              <MjmlText {...h4Props}>YouFound</MjmlText>
            </MjmlSection>
            <MjmlDivider borderWidth="1px" borderColor="#E9F2F0" />
            <MjmlSection>
              <MjmlText {...h3Props}>{tagline}</MjmlText>
            </MjmlSection>
            <MjmlSection backgroundColor="#E9F2F0" padding="1rem">
              <MjmlSection backgroundColor="#ffffff" padding="1rem">
                <MjmlText {...body1Props}>
                  <span style={{ fontSize: '1.5em' }}>“</span>
                  {message}
                  <span style={{ fontSize: '1.5em' }}>&rdquo;</span>
                </MjmlText>
              </MjmlSection>
            </MjmlSection>
            <MjmlSection padding="1rem">
              <MjmlText {...body1Props}>
                Since this is a one-way message, you cannot reply
              </MjmlText>
            </MjmlSection>
          </MjmlSection>

          <MjmlSection fullWidth>
            <MjmlText
              {...body1Props}
              color="#999999"
              fontSize="small"
              align="center"
            >
              Powered by&nbsp;<a href={process.env.ORIGIN}>YouFound</a>
            </MjmlText>
          </MjmlSection>
        </MjmlColumn>
      </MjmlBody>
    </Mjml>
  );
};

export function renderEmailTemplate(props: EmailTemplateProps) {
  return render(<EmailTemplate {...props} />, {
    validationLevel: 'soft'
  });
}
