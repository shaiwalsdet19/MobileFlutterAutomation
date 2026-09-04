package com.api.framework.mobile.modules.recruitment;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.recruitment.RecruitmentSettingsWeb;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.recruitment.ReferFunctionalityMethods;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class ReferFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(ReferFunctional.class);
    private ReferFunctionalityMethods referFunctionalityMethods;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        referFunctionalityMethods = new ReferFunctionalityMethods();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void refer(Map<String, String> data) throws Exception {
        logger.info("Running test: {}", data.get("TestCaseName"));

        String key = data.get("Key");
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("Key is missing in test data for method: refer");
        }

        // Apply block_refer setting via Chrome browser before running mobile test
        String blockRefer = data.get("block_refer");
        if (blockRefer != null) {
            logger.info("Applying setting via browser: block_refer={}", blockRefer);
            RecruitmentSettingsWeb.updateSetting("block_refer", blockRefer);
        }

        switch (key) {
            case "referCandidate":
                referFunctionalityMethods.referFunctionality(data, "referCandidate");
                break;
            case "referSetting":
                referFunctionalityMethods.referFunctionality(data, "referModuleEnableCheck");
                break;
            case "referSettingOff":
                referFunctionalityMethods.referFunctionality(data, "referModuleDisableCheck");
                break;
            default:
                throw new IllegalArgumentException("Unsupported test key: " + key);
        }
    }
}
