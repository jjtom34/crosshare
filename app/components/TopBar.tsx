import {
  ReactNode,
  useState,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { FaHammer, FaUser, FaUserLock } from 'react-icons/fa';

import { IoMdCloseCircleOutline } from 'react-icons/io';
import { AuthContext } from './AuthContext';
import { Link } from './Link';
import { Overlay } from './Overlay';
import { Logo } from './Icons';
import {
  HEADER_HEIGHT,
  SMALL_AND_UP,
  HAS_PHYSICAL_KEYBOARD,
} from '../lib/style';
import { ButtonResetCSS } from './Buttons';
import { NotificationT } from '../lib/notifications';
import { slugify } from '../lib/utils';
import { App } from '../lib/firebaseWrapper';
import { EmbedContext } from './EmbedContext';
import { Trans, t } from '@lingui/macro';

export const TopBarDropDown = (props: {
  onClose?: () => void;
  text: string;
  icon: ReactNode;
  hoverText?: string;
  children: (close: () => void) => ReactNode;
}) => {
  const [dropped, setDropped] = useState(false);
  const close = () => {
    props.onClose?.();
    setDropped(false);
  };
  return (
    <>
      <TopBarLink
        onClick={() => setDropped(!dropped)}
        text={props.text}
        icon={props.icon}
        hoverText={props.hoverText}
      />
      <Overlay onClick={close} closeCallback={close} hidden={!dropped}>
        {props.children(close)}
      </Overlay>
    </>
  );
};

export const NestedDropDown = (props: {
  onClose?: () => void;
  text: string;
  icon: ReactNode;
  closeParent: () => void;
  children: (close: () => void) => ReactNode;
}) => {
  const [dropped, setDropped] = useState(false);
  const close = () => {
    props.onClose?.();
    setDropped(false);
  };
  return (
    <>
      <TopBarDropDownLink
        onClick={() => {
          props.closeParent();
          setDropped(true);
        }}
        text={props.text}
        icon={props.icon}
      />
      <Overlay onClick={close} closeCallback={close} hidden={!dropped}>
        {props.children(close)}
      </Overlay>
    </>
  );
};

interface TopBarDropDownLinkCommonProps {
  shortcutHint?: ReactNode;
  text: string;
  icon: ReactNode;
}
const TopBarDropDownLinkContents = (props: TopBarDropDownLinkCommonProps) => {
  return (
    <>
      <div
        css={{
          verticalAlign: 'baseline',
          fontSize: HEADER_HEIGHT - 10,
          display: 'inline-block',
          width: '35%',
          textAlign: 'right',
          marginRight: '5%',
        }}
      >
        {props.icon}
      </div>
      <div
        css={{
          verticalAlign: 'baseline',
          fontSize: HEADER_HEIGHT - 20,
          display: 'inline-block',
          width: '60%',
          textAlign: 'left',
        }}
      >
        {props.text}
        {props.shortcutHint ? (
          <span
            css={{
              display: 'none',
              [HAS_PHYSICAL_KEYBOARD]: { display: 'inline' },
            }}
          >
            {' '}
            (<Trans>hotkey</Trans>:{' '}
            <span css={{ fontSize: HEADER_HEIGHT - 10 }}>
              {props.shortcutHint}
            </span>{' '}
            )
          </span>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

interface TopBarDropDownLinkProps extends TopBarDropDownLinkCommonProps {
  onClick?: () => void;
}
export const TopBarDropDownLink = (props: TopBarDropDownLinkProps) => {
  return (
    <button
      title={props.text}
      css={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        margin: 0,
        padding: '0.5em',
        width: '100%',
        color: 'var(--text)',
        '&:hover, &:focus': {
          textDecoration: 'none',
          backgroundColor: 'var(--top-bar-hover)',
        },
      }}
      onClick={props.onClick}
    >
      <TopBarDropDownLinkContents {...props} />
    </button>
  );
};

interface TopBarDropDownLinkAProps extends TopBarDropDownLinkCommonProps {
  href: string;
}
export const TopBarDropDownLinkA = (props: TopBarDropDownLinkAProps) => {
  return (
    <Link
      href={props.href}
      title={props.text}
      css={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        margin: 0,
        padding: '0.5em',
        width: '100%',
        color: 'var(--text)',
        '&:hover, &:focus': {
          color: 'var(--text)',
          textDecoration: 'none',
          backgroundColor: 'var(--top-bar-hover)',
        },
      }}
    >
      <TopBarDropDownLinkContents {...props} />
    </Link>
  );
};

export const TopBarDropDownLinkSimpleA = (props: TopBarDropDownLinkAProps) => {
  const isEmbed = useContext(EmbedContext);
  return (
    <a
      {...(isEmbed && { target: '_blank', rel: 'noreferrer' })}
      href={props.href}
      title={props.text}
      css={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        margin: 0,
        padding: '0.5em',
        width: '100%',
        color: 'var(--onprimary)',
        '&:hover, &:focus': {
          color: 'var(--onprimary)',
          textDecoration: 'none',
          backgroundColor: 'var(--top-bar-hover)',
        },
      }}
    >
      <TopBarDropDownLinkContents {...props} />
    </a>
  );
};

interface TopBarLinkCommonProps {
  text?: string;
  hoverText?: string;
  keepText?: boolean;
  icon: ReactNode;
  onClick?: () => void;
}
const TopBarLinkContents = (props: TopBarLinkCommonProps) => {
  return (
    <>
      <span
        css={{
          verticalAlign: 'baseline',
          fontSize: HEADER_HEIGHT - 10,
        }}
      >
        {props.icon}
      </span>
      {props.text ? (
        <span
          css={{
            marginLeft: '5px',
            verticalAlign: 'middle',
            display: props.keepText ? 'inline-block' : 'none',
            fontSize: HEADER_HEIGHT - 20,
            [SMALL_AND_UP]: {
              display: 'inline-block',
            },
          }}
        >
          {props.text}
        </span>
      ) : (
        ''
      )}
    </>
  );
};

interface TopBarLinkProps extends TopBarLinkCommonProps {
  onClick?: () => void;
}

export const TopBarLink = (props: TopBarLinkProps) => {
  return (
    <button
      title={props.hoverText || props.text}
      css={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline',
        margin: 0,
        padding: '0 0.45em',
        color: 'var(--onprimary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        '&:hover, &:focus': {
          textDecoration: 'none',
          backgroundColor: 'var(--top-bar-hover)',
        },
      }}
      onClick={props.onClick}
    >
      <TopBarLinkContents {...props} />
    </button>
  );
};

interface TopBarLinkAProps extends TopBarLinkCommonProps {
  disabled?: boolean;
  href: string;
  as?: string;
}

export const TopBarLinkA = (props: TopBarLinkAProps) => {
  return (
    <Link
      href={props.href}
      title={props.hoverText || props.text}
      css={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        height: '100%',
        backgroundColor: props.disabled ? 'var(--bg)' : 'transparent',
        border: 'none',
        cursor: props.disabled ? 'default' : 'pointer',
        pointerEvents: props.disabled ? 'none' : 'auto',
        textDecoration: 'none',
        margin: 0,
        padding: '0 0.45em',
        color: 'var(--onprimary)',
        '&:hover, &:focus': {
          color: 'var(--onprimary)',
          textDecoration: 'none',
          backgroundColor: props.disabled
            ? 'var(--bg)'
            : 'var(--top-bar-hover)',
        },
      }}
      onClick={props.onClick}
    >
      <TopBarLinkContents {...props} />
    </Link>
  );
};

export const TopBar = ({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}) => {
  const { notifications } = useContext(AuthContext);
  const isEmbed = useContext(EmbedContext);
  const now = new Date();
  const filtered = notifications?.filter((n) => n.t.toDate() <= now);
  const [showingNotifications, setShowingNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: Event) => {
      if (
        showingNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowingNotifications(false);
      }
    },
    [showingNotifications]
  );

  useEffect(() => {
    if (!filtered?.length) {
      setShowingNotifications(false);
    }
  }, [filtered]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return useMemo(() => {
    const today = new Date();
    return (
      <>
        <header
          css={{
            height: HEADER_HEIGHT,
            background: 'var(--primary)',
            color: 'var(--onprimary)',
            /* Pride month */
            ...(!isEmbed &&
              today.getUTCMonth() === 5 && {
              background:
                  'linear-gradient(to right, indianred,orange,gold,darkseagreen,deepskyblue,violet)',
              '@media (prefers-color-scheme: dark)': {
                background:
                    'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), linear-gradient(to right, indianred,orange,gold,darkseagreen,deepskyblue,violet)',
              },
            }),
            /* Transgender day of remembrance */
            ...(!isEmbed &&
              today.getUTCMonth() === 10 &&
              today.getUTCDate() === 20 && {
              background:
                  'linear-gradient(to right, #50DFE4 0% 15%,#FFA6D6 25% 35%,#FFFFFF 45% 55%,#FFA6D6 65% 75%,#50DFE4 85% 100%)',
              '@media (prefers-color-scheme: dark)': {
                background:
                    'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), linear-gradient(to right, #50DFE4 0% 15%,#FFA6D6 25% 35%,#FFFFFF 45% 55%,#FFA6D6 65% 75%,#50DFE4 85% 100%)',
              },
            }),
          }}
        >
          <div
            css={{
              padding: '0 10px',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              lineHeight: HEADER_HEIGHT - 4 + 'px',
            }}
          >
            {isEmbed ? (
              <div
                title={title}
                css={{
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginLeft: '5px',
                  color: 'var(--onprimary)',
                  fontSize: HEADER_HEIGHT - 10,
                  [SMALL_AND_UP]: {
                    display: 'inline-block',
                  },
                }}
              >
                {title}
              </div>
            ) : filtered?.length && !showingNotifications ? (
              <button
                type="button"
                onClick={() => setShowingNotifications(true)}
                css={[
                  ButtonResetCSS,
                  {
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                  },
                ]}
                title="View Notifications"
              >
                <Logo
                  notificationCount={filtered.length}
                  width={HEADER_HEIGHT - 4}
                  height={HEADER_HEIGHT - 4}
                />
                <span
                  css={{
                    marginLeft: '5px',
                    display: 'none',
                    color: 'var(--onprimary)',
                    fontSize: HEADER_HEIGHT - 10,
                    [SMALL_AND_UP]: {
                      display: 'inline-block',
                    },
                  }}
                >
                  CROSSHARE
                </span>
              </button>
            ) : (
              <Link
                href="/"
                css={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none !important',
                  cursor: 'pointer',
                }}
                title="Crosshare Home"
              >
                <Logo
                  notificationCount={0}
                  width={HEADER_HEIGHT - 4}
                  height={HEADER_HEIGHT - 4}
                />
                <span
                  css={{
                    marginLeft: '5px',
                    display: 'none',
                    color: 'var(--onprimary)',
                    fontSize: HEADER_HEIGHT - 10,
                    [SMALL_AND_UP]: {
                      display: 'inline-block',
                    },
                  }}
                >
                  CROSSHARE
                </span>
              </Link>
            )}
            <>{children}</>
          </div>
        </header>
        {filtered?.length && showingNotifications ? (
          <div
            ref={notificationsRef}
            css={{
              position: 'absolute',
              top: HEADER_HEIGHT + 10,
              left: 5,
              border: '1px solid var(--text-input-border)',
              boxShadow: '0 0 5px 5px rgba(0,0,0,0.5)',
              backgroundColor: 'var(--overlay-inner)',
              width: 'calc(100vw - 10px)',
              maxWidth: '30em',
              borderRadius: 5,
              zIndex: 102,
              '&:before': {
                content: '""',
                position: 'absolute',
                top: -19,
                left: 10,
                zIndex: 101,
                border: 'solid 10px transparent',
                borderBottomColor: 'var(--overlay-inner)',
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: 10,
                zIndex: 100,
                border: 'solid 10px transparent',
                borderBottomColor: 'var(--text-input-border)',
              },
            }}
          >
            <h3
              css={{
                borderBottom: '1px solid var(--text-input-border)',
                margin: '0.5em 0 0 0',
                paddingLeft: '1em',
                fontSize: '1em',
                fontWeight: 'bold',
              }}
            >
              Notifications
            </h3>
            <div css={{ margin: '0 1em' }}>
              {filtered.map((n) => (
                <NotificationLink key={n.id} notification={n} />
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }, [
    children,
    filtered,
    showingNotifications,
    setShowingNotifications,
    isEmbed,
    title,
  ]);
};

const NotificationLinkCSS = {
  display: 'block',
  flex: 1,
  color: 'var(--text)',
  padding: '1em',
  '&:hover, &:focus': {
    color: 'var(--text)',
    textDecoration: 'none',
    backgroundColor: 'var(--top-bar-hover)',
  },
};

const ANIMATION_DELAY = 250;

const NotificationLink = ({
  notification: n,
}: {
  notification: NotificationT;
}): JSX.Element => {
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    // Close the toast which causes it to start shrinking
    setClosing(true);
    // After shrink vertically we remove the toast
    setTimeout(() => {
      App.firestore().collection('n').doc(n.id).update({ r: true });
    }, ANIMATION_DELAY);
  }, [n.id]);

  let link: JSX.Element;
  switch (n.k) {
  case 'comment':
    link = (
      <Link css={NotificationLinkCSS} href={`/crosswords/${n.p}/${slugify(n.pn)}`}>
        {n.cn} commented on <u>{n.pn}</u>
      </Link>
    );
    break;
  case 'reply':
    link = (
      <Link css={NotificationLinkCSS} href={`/crosswords/${n.p}/${slugify(n.pn)}`}>
        {n.cn} replied to your comment on <u>{n.pn}</u>
      </Link>
    );
    break;
  case 'newpuzzle':
    link = (
      <Link css={NotificationLinkCSS} href={`/crosswords/${n.p}/${slugify(n.pn)}`}>
        {n.an} published a new puzzle: <u>{n.pn}</u>
      </Link>
    );
    break;
  case 'featured':
    link = (
      <Link css={NotificationLinkCSS} href={`/crosswords/${n.p}/${slugify(n.pn)}`}>
          Crosshare is featuring your puzzle <u>{n.pn}</u>
        {n.as ? ` as ${n.as}` : ' on the homepage'}!
      </Link>
    );
    break;
  }
  return (
    <div
      css={{
        transition: 'all ' + ANIMATION_DELAY + 'ms ease-in-out 0s',
        maxHeight: 500,
        overflow: 'hidden',
        ...(closing && { maxHeight: 0 }),
        display: 'flex',
        alignItems: 'center',
        '& + &': {
          borderTop: '1px solid var(--text-input-border)',
        },
      }}
    >
      {link}
      <div
        role="button"
        tabIndex={0}
        onClick={close}
        onKeyPress={close}
        css={{
          paddingLeft: '1em',
          cursor: 'pointer',
        }}
      >
        <IoMdCloseCircleOutline />
      </div>
    </div>
  );
};

export const DefaultTopBar = ({
  dashboardSelected,
  accountSelected,
  children,
}: {
  dashboardSelected?: boolean;
  accountSelected?: boolean;
  children?: ReactNode;
}) => {
  const ctxt = useContext(AuthContext);

  return (
    <TopBar>
      {children}
      {ctxt.isAdmin ? (
        <TopBarLinkA href="/admin" icon={<FaUserLock />} text="Admin" />
      ) : (
        ''
      )}
      {ctxt.user && ctxt.user.email ? (
        <TopBarLinkA
          disabled={dashboardSelected}
          href="/dashboard"
          icon={<FaHammer />}
          text={t`Constructor Dashboard`}
        />
      ) : (
        ''
      )}
      <TopBarLinkA
        disabled={accountSelected}
        href="/account"
        icon={<FaUser />}
        text={t`Account`}
      />
    </TopBar>
  );
};
