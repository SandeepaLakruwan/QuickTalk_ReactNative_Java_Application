/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author sande
 */
@MultipartConfig
@WebServlet(name = "UpdateProfile", urlPatterns = {"/UpdateProfile"})
public class UpdateProfile extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        String id = request.getParameter("id");
        String mobile = request.getParameter("mobile");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String password = request.getParameter("password");
        Part avatarImage = request.getPart("avatarImage");
        
        if (id.isEmpty()) {
            responseJson.addProperty("message", "Id didn't find. Please try again");
        } else if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Mobile Number didn't find");
        } else if (firstName.isEmpty()) {
            responseJson.addProperty("message", "Please fill First Name");
        } else if (lastName.isEmpty()) {
            responseJson.addProperty("message", "Please fill Last Name");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please fill Password");
        } else if (!Validations.isPasswordValid(password)) {
            responseJson.addProperty("message", "Invalid Password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            //search mobile
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("id", Integer.valueOf(id)));

            if (criteria.list().isEmpty()) {
                //mobile already used
                responseJson.addProperty("message", "Can't find user. Please try again later.");

            } else {
                User selectedUser = (User) criteria.uniqueResult();

                selectedUser.setFirst_name(firstName);
                selectedUser.setLast_name(lastName);
                selectedUser.setPassword(password);

                session.update(selectedUser);
                session.beginTransaction().commit();

                //check uploaded image
                if (avatarImage != null) {
                    //image selected

                    String serverPath = request.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + File.separator + "avatar_images" + File.separator + mobile + ".png";
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    
                    String newServerPath = serverPath.replace("build"+File.separator+"web", "web");
                    String newAvatarImagePath = newServerPath + File.separator + "avatar_images" + File.separator + mobile + ".png";
                    File file2 = new File(newAvatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    
                }else{
                    System.out.println("Image not");
                }

                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Update Success.");

            }

            session.close();
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

        
    }

}