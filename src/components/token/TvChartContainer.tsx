import { useEffect, useRef } from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from "../../../public/static/charting_library";
import { frogFunApi } from "@/config/env";

export const TVChartContainer = (props: Partial<ChartingLibraryWidgetOptions>) => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(`${frogFunApi}/trade`, undefined, {
        maxResponseLength: 5000,
        expectedOrder: "latestFirst",
        supports_search: true,
        supports_group_request: true,
      }),
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: "dark",
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        tvWidget.applyOverrides({
          "mainSeriesProperties.minTick": "1000000000,1,false",
        });
      });
    });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return (
    <>
      <header></header>
      <div ref={chartContainerRef} className="h-[425px] bg-dark-gray" />
    </>
  );
};
