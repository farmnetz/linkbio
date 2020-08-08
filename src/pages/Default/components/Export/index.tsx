import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import ILists from '../../../../dtos/ILists';
import templates from './templates';
import api from '../../../../services/api';

const Styled = styled.div`
  margin: 40px 0;
`;

const LinkOrCode = styled.div`
  h3 {
    margin: 20px 0;
  }

  & > div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0 20px;
  }

  h4 {
    font-weight: bold;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: square;
    margin-bottom: 20px;
    margin-left: 20px;
  }
`;

const Export = ({ social, header, links }: ILists) => {
  const { t } = useTranslation();
  const [exportType, setExportType] = useState('url');
  const [finalString, setFinalString] = useState('');
  const [shortened, setShortened] = useState('');
  const [error, setError] = useState('');

  const shorten = useCallback(() => {
    api
      .post(
        'https://api-ssl.bitly.com/v4/shorten',
        {
          group_guid: 'Bk42nAyCf1T',
          domain: 'bit.ly',
          long_url: finalString,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_BITLY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        setShortened(response.data.link);
      })
      .catch(() => {
        setError(t('Export error'));
      });
  }, [finalString, t]);

  const exportList = useCallback(
    (type) => {
      const string = templates(type, { social, header, links });
      setFinalString(string);
    },
    [social, header, links],
  );

  useEffect(() => {
    const string = templates('url', { social, header, links });
    setFinalString(string);
  }, [exportList, social, header, links]);

  const handleChange = useCallback(
    (type) => {
      setFinalString('');
      setExportType(type);
      exportList(type);
    },
    [exportList],
  );

  return (
    <Styled>
      <h2>{t('Export title')}</h2>
      <form>
        <label
          className={`button-label ${exportType === 'url' ? 'checked' : ''}`}
          htmlFor="export-URL"
        >
          {t('Export long URL')}
          <input
            type="radio"
            name="export"
            id="export-URL"
            checked={exportType === 'url'}
            onChange={() => handleChange('url')}
          />
        </label>
        <label
          className={`button-label ${exportType === 'code' ? 'checked' : ''}`}
          htmlFor="export-code"
        >
          {t('Export code for self-hosting')}
          <input
            type="radio"
            name="export"
            id="export-code"
            checked={exportType === 'code'}
            onChange={() => handleChange('code')}
          />
        </label>
      </form>

      <textarea
        name="export"
        id="export"
        cols={30}
        rows={10}
        readOnly
        value={finalString}
      />

      {exportType === 'url' ? (
        <button type="button" onClick={shorten}>
          {t('Get short')}
        </button>
      ) : (
        ''
      )}

      {error ? <small>{error}</small> : ''}

      {shortened ? (
        <input
          type="text"
          name="shortened"
          id="shortened"
          defaultValue={shortened}
          readOnly
        />
      ) : (
        ''
      )}

      <LinkOrCode>
        <h3>{t('Link or code')}</h3>
        <div>
          <div>
            <Trans i18nKey="Link explanation">
              <h4>Link:</h4>
              <ul>
                <li>
                  <b>Pros:</b>easy as click-copy-paste. Get the provided URL —
                  or it's shortened version — and paste it wherever you like.
                </li>
                <li>
                  <b>Cons:</b> Every time you change your list, you will need to
                  change the links everywhere.
                </li>
              </ul>
            </Trans>
          </div>
          <div>
            <Trans i18nKey="Code explanation">
              <h4>Link:</h4>
              <ul>
                <li>
                  <b>Pros:</b>easy as click-copy-paste. Get the provided URL —
                  or it's shortened version — and paste it wherever you like.
                </li>
                <li>
                  <b>Cons:</b> Every time you change your list, you will need to
                  change the links everywhere.
                </li>
              </ul>
            </Trans>
          </div>
        </div>
      </LinkOrCode>
    </Styled>
  );
};

export default Export;