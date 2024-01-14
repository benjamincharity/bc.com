import React, { ForwardedRef, ReactElement, useEffect, useState } from 'react';

type FixMeLater = any;

const DEFAULT_INFO_INTRO_DELAY = 7000;
const DEFAULT_INFO_EXIT_DELAY = DEFAULT_INFO_INTRO_DELAY * 2;

export interface InfoBubbleProps {
  animationsArePaused?: boolean;
  userHasInteractedWithInfoPanel?: boolean;
  togglePauseRequest: () => void;
  ref: React.Ref<FixMeLater>;
}

export const InfoBubble = React.forwardRef<FixMeLater, InfoBubbleProps>(
  (props: InfoBubbleProps, ref: ForwardedRef<FixMeLater>): ReactElement => {
    const {
      animationsArePaused,
      togglePauseRequest,
      userHasInteractedWithInfoPanel,
    } = props;
    const [shouldShowBackground, setShouldShowBackground] = useState(false);
    const [showInfo, setShowInfo] = React.useState<boolean>(false);
    const [showPopover, setShowPopover] = React.useState<boolean>(false);

    useEffect(() => {
      let exitTimeoutId: NodeJS.Timeout;

      const introTimeoutId = setTimeout(() => {
        setShowInfo(true);

        exitTimeoutId = setTimeout(() => {
          setShowInfo(false);
        }, DEFAULT_INFO_EXIT_DELAY);
      }, DEFAULT_INFO_INTRO_DELAY);

      return () => {
        clearTimeout(introTimeoutId);
        clearTimeout(exitTimeoutId);
      };
    }, [userHasInteractedWithInfoPanel]);

    return (
      <div className={'bc-info'} ref={ref}>
        <input
          className="u-sr-only-always"
          id="popoverTrigger"
          type="checkbox"
          onChange={(e) => {
            console.log('onchange', e);
            setShowPopover(e.target.checked);
            // setUserHasInteractedWithInfoPanel(true);
          }}
        />
        <label
          className={`info ${showInfo ? 'info--visible' : ''}`}
          htmlFor="popoverTrigger"
        >
          <span aria-hidden="true">?</span>
          <span className="u-sr-only-always">Site info</span>
        </label>

        <div
          className={`info__popover ${
            showPopover ? 'info__popover--visible' : ''
          }`}
        >
          <div className="info__popover-content">
            <p>
              Change the color palette by clicking the background or using the
              left & right arrow keys.
            </p>
            <p>If you prefer, you can pause the background animations:</p>
            <div className="info__pause">
              <button
                className="info__pause-button"
                onClick={togglePauseRequest}
              >
                {animationsArePaused ? 'Resume' : 'Pause'} Animations
              </button>
            </div>
            <div className="info__not-so-subtle-hint">↑↑↓↓←→←→BA</div>
          </div>
        </div>
      </div>
    );
  },
);

InfoBubble.displayName = 'InfoBubble';
