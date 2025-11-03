"use client";
import { GithubYears, SiteConfig } from "../../constants";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const GithubContributions = () => {
  const [year, setYear] = useState(GithubYears[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const theme = {
    light: ['#ede9fe', '#e0c7f6', '#c084fc', '#9333ea', '#6b21a8'],
    dark: ['#2b173d', '#c084fc', '#9333ea', '#6b21a8', '#581c87']
  };

  return (
    <div className="mt-20 space-y-7 overflow-hidden bg-slate-50 dark:bg-[#0f0017] mx-10">
      <p className="text-3xl flex justify-center items-center text-neutral-950 dark:text-slate-50 font-bold font-serif">
        GitHub Contribution Graph
      </p>
      <div className="flex justify-center items-center xl:flex-row md:items-center flex-col gap-4">
        <div className="max-w-full overflow-x-auto text-neutral-950 dark:text-slate-50">
          <div className="bg-secondary/30 border border-divider p-8 rounded-lg max-w-fit max-h-fit z-20">
            <GitHubCalendar
              key={year}
              username={SiteConfig.user.socials.githubUserId}
              year={year}
              theme={theme}
              colorScheme={isDarkMode ? "dark" : "light"}
              renderBlock={(block, activity) => (
                <Tooltip
                  showArrow
                  content={`${activity.count} activities on ${activity.date}`}
                  className="bg-black text-white font-openSans"
                >
                  {block}
                </Tooltip>
              )}
              labels={{
                totalCount: `{{count}} contributions in ${year}`,
              }}
            />
          </div>
        </div>
        <div className="flex justify-center xl:flex-col flex-row flex-wrap gap-2">
          {GithubYears.map((y) => (
            <Button
              key={y}
              variant={y === year ? "solid" : "light"}
              size="md"
              radius="full"
              className={y === year ? "bg-purple-400 hover:bg-purple-500 text-black font-serif" : "font-serif text-neutral-950 dark:text-slate-50"}
              onPress={() => setYear(y)}
            >
              {y}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GithubContributions;