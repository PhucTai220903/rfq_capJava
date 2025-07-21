package customer.rfq.handlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.UserInfo;

import cds.gen.referenceservice.GetUserRolesContext;

import java.util.ArrayList;
import java.util.List;

@Component
@ServiceName("ReferenceService")
public class ReferenceService implements EventHandler {

    @Autowired
    UserInfo userInfo;

    @On(event = "getUserRoles")
    public void onGetUserRoles(GetUserRolesContext context) {
        System.out.println("Getting user roles...");
        List<String> roles = new ArrayList<>(userInfo.getRoles());
        context.setResult(roles);
    }
}
