/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author sande
 */
@WebServlet(name = "LoadChatList", urlPatterns = {"/LoadChatList"})
public class LoadChatList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);
        responseJson.addProperty("message", "Unable to process your request.");

        try {

            Session session = HibernateUtil.getSessionFactory().openSession();

            //get user id,text from request parameters
            String userId = request.getParameter("id");
            String text = request.getParameter("text");

            //get user object
            User user = (User) session.get(User.class, Integer.valueOf(userId));

            //get user status =1 (online)
            User_Status user_Status = (User_Status) session.get(User_Status.class, 1);

            //update user status
            user.setUser_Status(user_Status);
            session.update(user);

            //get other users
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.ne("id", user.getId()));
            criteria1.add(Restrictions.ilike("first_name", text, MatchMode.START));

            List<User> otherUserList = criteria1.list();

            //get other user one by one
            JsonArray jsonChatArray = new JsonArray();
            for (User otherUser : otherUserList) {

                //get chat list
                Criteria criteria2 = session.createCriteria(Chat.class);
                criteria2.add(
                        Restrictions.or(
                                Restrictions.and(
                                        Restrictions.eq("from_user", user),
                                        Restrictions.eq("to_user", otherUser)
                                ),
                                Restrictions.and(
                                        Restrictions.eq("from_user", otherUser),
                                        Restrictions.eq("to_user", user)
                                )
                        )
                );
                criteria2.addOrder(Order.desc("id"));
                criteria2.setMaxResults(1);

                JsonObject jsonChatItem = new JsonObject();
                jsonChatItem.addProperty("other_user_id", otherUser.getId());
                jsonChatItem.addProperty("other_user_mobile", otherUser.getMobile());
                jsonChatItem.addProperty("other_user_name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
                jsonChatItem.addProperty("other_user_status", otherUser.getUser_Status().getId()); //1=online 2=offline

                //check avatar image
                String serverPath = request.getServletContext().getRealPath("");
                String otherUserAvatarImagePath = serverPath + File.separator + "avatar_images" + File.separator + otherUser.getMobile() + ".png";
                File otherUserAvatarFile = new File(otherUserAvatarImagePath);

                if (otherUserAvatarFile.exists()) {
                    //image found
                    jsonChatItem.addProperty("avatar_image_found", true);

                } else {
                    //image not found
                    jsonChatItem.addProperty("avatar_image_found", false);
                    jsonChatItem.addProperty("other_user_avatar_letters", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));

                }

                //get chat list
                List<Chat> dbChatList = criteria2.list();

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MM dd hh:ss a");

                if (criteria2.list().isEmpty()) {
                    //no conversation
                    jsonChatItem.addProperty("newChat", true);
                    jsonChatItem.addProperty("message", "Let's start new Conversation");
                    jsonChatItem.addProperty("dateTime", dateFormat.format(user.getRegistered_date_time()));
                    jsonChatItem.addProperty("chat_status_id", 1); //1=seen 2=unseen
                    jsonChatItem.addProperty("messageUser", false);
                    jsonChatItem.addProperty("unseenMessage", false);
                } else {
                    //found conversation
                    if (dbChatList.get(0).getFrom_user() == user) {
                        jsonChatItem.addProperty("newChat", false);
                        jsonChatItem.addProperty("message", dbChatList.get(0).getMessage());
                        jsonChatItem.addProperty("dateTime", dateFormat.format(dbChatList.get(0).getDate_time()));
                        jsonChatItem.addProperty("chat_status_id", dbChatList.get(0).getChat_Status().getId());//1=seen 2=unseen
                        jsonChatItem.addProperty("messageUser", true);
                        jsonChatItem.addProperty("unseenMessage", false);
                    } else {
                        jsonChatItem.addProperty("newChat", false);
                        jsonChatItem.addProperty("message", dbChatList.get(0).getMessage());
                        jsonChatItem.addProperty("dateTime", dateFormat.format(dbChatList.get(0).getDate_time()));
                        jsonChatItem.addProperty("chat_status_id", dbChatList.get(0).getChat_Status().getId());//1=seen 2=unseen
                        jsonChatItem.addProperty("messageUser", false);

                        if (dbChatList.get(0).getChat_Status().getId() == 2) {
                            jsonChatItem.addProperty("unseenMessage", true);
                        } else {
                            jsonChatItem.addProperty("unseenMessage", false);
                        }
                    }
                }

                jsonChatArray.add(jsonChatItem);
            }

            //send users
            responseJson.addProperty("status", true);
            responseJson.addProperty("message", "Success");
            responseJson.add("jsonChatArray", gson.toJsonTree(jsonChatArray));

            session.beginTransaction().commit();

            session.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
