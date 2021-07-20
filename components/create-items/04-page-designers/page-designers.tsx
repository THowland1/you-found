import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { SubformParams } from '../subform-params';
import styles from './page-designers.module.scss';
import PageDesigner from './page-designer/page-designer';
import { PageDesignersSubform } from './page-designers-subform';
import { PageDesignerSubform } from './page-designer/page-designer-subform';
import { Step } from '../step';
import { pipeWith } from 'utils/pipe';
import {
  ensureNotNullCurrentItemId,
  getNextItemId,
  hasNextItemId,
  refreshPages,
} from './page-designers-subform-transforms';

type Params = SubformParams;

export default function CreateItemsPageDesigners({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);
  const [pageDesignersSubform, setPageDesignersSubform] = useState(
    pipeWith(
      form['04-page-designers'],
      (value) => refreshPages(value, form['01-names'].items),
      (value) => ensureNotNullCurrentItemId(value)
    )
  );
  function setSubformAndUpdateForm(value: PageDesignersSubform) {
    setPageDesignersSubform(value);
    setForm({ ...form, '04-page-designers': value });
  }

  function setPageAndUpdateSubformAndForm(
    value: PageDesignerSubform,
    itemId: string
  ) {
    const newPageDesignersSubform: PageDesignersSubform = {
      ...pageDesignersSubform,
      pages: { ...pageDesignersSubform.pages, [itemId]: value },
    };
    setSubformAndUpdateForm(newPageDesignersSubform);
  }

  function onSubsubmit(value: PageDesignerSubform, itemId: string) {
    const hasNextPage = hasNextItemId(pageDesignersSubform);
    const newCurrentItemId = hasNextPage
      ? getNextItemId(pageDesignersSubform)
      : pageDesignersSubform.currentItemId;
    const newPages = { ...pageDesignersSubform.pages, [itemId]: value };

    const newSubform = {
      currentItemId: newCurrentItemId,
      pages: newPages,
    };
    setSubformAndUpdateForm(newSubform);

    if (!hasNextPage) {
      onSubmit();
    }
  }

  function onSubmit() {
    setForm({ ...form, step: Step.Success }); //////////////////////
  }

  const currentItem = form['01-names'].items.find(
    (item) => item.id === pageDesignersSubform.currentItemId
  );
  if (!currentItem) {
    throw new Error('Current item does not exist');
  }

  return (
    <>
      <div className={styles['create-user-page']}>
        <header className={styles.header}>
          <Typography
            className={styles.muted}
            variant='h6'
            align='center'
            component='h1'
          >
            Create QR codes
          </Typography>
          <Typography variant='h4' component='h2' align='center'>
            What shall people see when they scan the&nbsp;
            <em>{currentItem.name}</em>&nbsp;QR code?
          </Typography>
        </header>
        <div className={styles.content}>
          {Object.entries(pageDesignersSubform.pages).map(
            ([itemId, subsubform]) =>
              pageDesignersSubform.currentItemId === itemId ? (
                <PageDesigner
                  key={itemId}
                  page={subsubform}
                  setPage={(value) =>
                    setPageAndUpdateSubformAndForm(value, itemId)
                  }
                  form={form}
                  onSubmit={(value) => onSubsubmit(value, itemId)}
                  item={currentItem}
                ></PageDesigner>
              ) : null
          )}
        </div>
      </div>
    </>
  );
}
