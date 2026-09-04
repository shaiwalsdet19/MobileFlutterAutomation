package com.api.framework.mobile.modules.recruitment;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.recruitment.IJPFunctionalityMethods;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.recruitment.RecruitmentSettingsWeb;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class IJPFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(IJPFunctional.class);
    private IJPFunctionalityMethods ijpFunctionalityMethods;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        ijpFunctionalityMethods = new IJPFunctionalityMethods();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void ijp(Map<String, String> data) throws Exception {
        logger.info("Running test: {}", data.get("TestCaseName"));
        System.out.println(data.get("tenant") + "---->" + data.get("Employee") + "---->" + data.get("Password"));

        String key = data.get("Key");
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("Key is missing in test data for method: IJP");
        }

        // Apply block_ijp setting via Chrome browser before running mobile test
        String blockIjp = data.get("block_ijp");
        if (blockIjp != null) {
            logger.info("Applying setting via browser: block_ijp={}", blockIjp);
            RecruitmentSettingsWeb.updateSetting("block_ijp", blockIjp);
        }

        switch (key) {
            case "applyIJP":
                ijpFunctionalityMethods.ijp_Functionality(data, "applyIJP");
                break;
            case "ijpSetting":
                ijpFunctionalityMethods.ijp_Functionality(data, "ijpModuleEnableCheck");
                break;
            case "ijpSettingOff":
                ijpFunctionalityMethods.ijp_Functionality(data, "ijpModuleDisableCheck");
                break;
            default:
                assertEqualsCheck("Dbox", "DBX", "Came to default switch case, it means given key is not found");
        }
    }
}
