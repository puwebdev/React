import { orderLowercase } from '../../helpers/helpers';

export const deviceScreensOptionsFlattened = () => {
    let ds = window.config.deviceScreens,
        optionsArray = [];

    _.each(ds, (obKey, key) => {
        _.each(obKey, (obSubkey, subkey) => {
            _.each(obSubkey.locations, (loc, locKey) => {
                optionsArray.push(`${key}_____${subkey}_____${locKey}`);
            });
        });
    });

    return optionsArray.sort(orderLowercase);
}