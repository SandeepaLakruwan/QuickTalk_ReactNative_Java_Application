/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import entity.User_Status;
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
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author sande
 */
@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        //LoadChat?logged_user_id=1&other_user_id=2
        String logged_user_id = request.getParameter("logged_user_id");
        String other_user_id = request.getParameter("other_user_id");

        Session session = HibernateUtil.getSessionFactory().openSession();

        //get user
        User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));

        //get other user
        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

        //get chat
        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(
                Restrictions.or(
                        Restrictions.and(
                                Restrictions.eq("from_user", logged_user),
                                Restrictions.eq("to_user", other_user)
                        ),
                        Restrictions.and(
                                Restrictions.eq("from_user", other_user),
                                Restrictions.eq("to_user", logged_user)
                        )
                )
        );

        //get user status =2 (offline)
        User_Status user_Status = (User_Status) session.get(User_Status.class, 1);

        //update user status
        logged_user.setUser_Status(user_Status);
        session.update(logged_user);

        //sort chats
        criteria1.addOrder(Order.asc("date_time"));

        List<Chat> chat_list = criteria1.list();

        //get chat status = 1=seen
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 1);

        //create chat array
        JsonArray chatArray = new JsonArray();

        //create date time format
        SimpleDateFormat dateformat = new SimpleDateFormat("MMM dd, hh:mm a");
        for (Chat chat : chat_list) {

            //create chat object
            JsonObject chatObject = new JsonObject();
            chatObject.addProperty("message", chat.getMessage());
            chatObject.addProperty("datetime", dateformat.format(chat.getDate_time()));

            //get chats only other user
            if (chat.getFrom_user().getId() == other_user.getId()) {
                //add side to chat object
                chatObject.addProperty("side", "left");

                //get only unseen chats
                if (chat.getChat_Status().getId() == 2) {

                    //update chat status
                    chat.setChat_Status(chat_Status);
                    session.update(chat);
                }

            } else {
                //get chats from logged user
                //add side to chat object
                chatObject.addProperty("side", "right");
                chatObject.addProperty("status", chat.getChat_Status().getId());//1=seen,2=unseen

            }
            //add chat object into chat array
            chatArray.add(chatObject);

        }
        session.beginTransaction().commit();

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(chatArray));
    }

}
