package com.vmap.action;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import net.sf.json.JSONObject;

import com.vmap.util.ProcessProperties;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
public class FileAction extends ActionSupport {
	private String place;
	private String floor;
	private JSONObject resultObj;
	private ProcessProperties props = new ProcessProperties();
	private int pointnum;
	private double fromx;
	private double fromy;
	private String fromfloor;
	private double tox;
	private double toy;
	private String tofloor;
	private String poi;
	@Override
	public String execute() {
		Map<String,Object> result = new HashMap<String,Object>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd-SS");
		try{
			if(place == null || floor == null || place.length() == 0 || floor.length() == 0){
				result.put("success", "false");
				result.put("message", "place or floor is not right");
			}else{
		    	ServletContext sc = (ServletContext) ActionContext.getContext().get(ServletActionContext.SERVLET_CONTEXT);     
		        String desPath = sc.getRealPath("/"); 
				String picPath = props.getValue("basePath")+place.toLowerCase()+"/"+floor+"/svg-1_0.svg";
			
				FileInputStream fis = new FileInputStream(picPath);
		        BufferedInputStream bufis = new BufferedInputStream(fis);
		        Date date = new Date();
		        //FileOutputStream fos = new FileOutputStream(desPath+"map\\"+format.format(date)+".svg");
		        FileOutputStream fos = new FileOutputStream(desPath+"map\\"+floor+".svg");
		        BufferedOutputStream bufos = new BufferedOutputStream(fos);
		        int len = 0;
		        while ((len = bufis.read()) != -1) {
		            bufos.write(len);
		        }
		        bufis.close();
		        bufos.close();	
		        result.put("fileName",floor+".svg");
		    	result.put("success", "true");
			}
		}catch (FileNotFoundException e) {
			e.printStackTrace();
			result.put("success", "false");
			result.put("message", "can't find files");
		}catch (Exception e){
			e.printStackTrace();
			result.put("success", "false");
			result.put("message", e.toString());
		}
		resultObj = JSONObject.fromObject(result);
		return SUCCESS;
	}
	
	public String getXML() {
		Map<String,Object> result = new HashMap<String,Object>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd-SS");
		try{
			String xmlUrl = "http://123.57.46.160:55535/xml?"+pointnum+"&"+fromx+","+fromy
					+","+fromfloor+"&"+tox+","+toy+","+tofloor+"&"+poi+"";
			System.out.println(xmlUrl);
			ServletContext sc = (ServletContext) ActionContext.getContext().get(ServletActionContext.SERVLET_CONTEXT);     
	        String desPath = sc.getRealPath("/"); 
			URL url = new URL(xmlUrl);
			 HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			 connection.setConnectTimeout(3000);
			 connection.setDoInput(true);
			 connection.setRequestMethod("GET");
			 if( connection.getResponseCode() == 200 ) {
				 BufferedInputStream in = new BufferedInputStream(connection.getInputStream());
			 	Date date = new Date();
				 BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(desPath+"map\\"+format.format(date)+".xml"));
			 	int len = 0;
			 	while ((len = in.read()) != -1) {
			 		out.write(len);
			 	}
			 	in.close();
			 	out.close();	
			 	result.put("fileName", format.format(date)+".xml");
			 	result.put("success", "true");
			 }else{
				 result.put("success", "false");
				 result.put("message", "connection failed, please check parameters or server...");
			 }
		}catch(Exception e){
			e.printStackTrace();
			result.put("success", "false");
			result.put("message", e.toString());
		}
		resultObj = JSONObject.fromObject(result);
		return SUCCESS;
	}
	
	public String getPlace() {
		return place;
	}
	public void setPlace(String place) {
		this.place = place;
	}
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public JSONObject getResultObj() {
		return resultObj;
	}
	public void setResultObj(JSONObject resultObj) {
		this.resultObj = resultObj;
	}

	public int getPointnum() {
		return pointnum;
	}

	public void setPointnum(int pointnum) {
		this.pointnum = pointnum;
	}

	public double getFromx() {
		return fromx;
	}

	public void setFromx(double fromx) {
		this.fromx = fromx;
	}

	public double getFromy() {
		return fromy;
	}

	public void setFromy(double fromy) {
		this.fromy = fromy;
	}

	public String getFromfloor() {
		return fromfloor;
	}

	public void setFromfloor(String fromfloor) {
		this.fromfloor = fromfloor;
	}

	public double getTox() {
		return tox;
	}

	public void setTox(double tox) {
		this.tox = tox;
	}

	public double getToy() {
		return toy;
	}

	public void setToy(double toy) {
		this.toy = toy;
	}

	public String getTofloor() {
		return tofloor;
	}

	public void setTofloor(String tofloor) {
		this.tofloor = tofloor;
	}

	public String getPoi() {
		return poi;
	}

	public void setPoi(String poi) {
		this.poi = poi;
	}
	
}
