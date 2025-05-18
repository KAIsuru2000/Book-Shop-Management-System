package lk.brightbs.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

//configuration file ekak nisa
@Configuration
//web system ekak nisa web security unable karai
@EnableWebSecurity
public class WebConfiguration {

    //configuration liwimedi sadana kotas 4 ki
    //1.log wana user details
    //2.password
    //3.resources - security awashya netha namuth ui paththa block kala yuthuya e sadaha path tika block kala yuthuya
    //4.services 

    //bootstrap , css block kirima sadaha
     @Bean
     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //http request eka magin authanticat handel kirima
        //annonimus arrow function ekak lesa 
        // pass wana authantycation object eka auth ta leba eya access kara matches tika liyai
        // url access kirim sadaha
        //service authentication matching
         http.authorizeHttpRequests(auth -> {

            auth
            //bootstrap weda kirimata permisson laba dema
            .requestMatchers("/bootstrap-5.2.3/**").permitAll()
            .requestMatchers("/fontawesome-free-6.4.2/**").permitAll()
            .requestMatchers("/image/**").permitAll()
            .requestMatchers("/jsFiles/**").permitAll()
            .requestMatchers("/Style/**").permitAll()
            .requestMatchers("/datatables-1.13.6/**").permitAll()
            .requestMatchers("/jQuery v3.7.1/**").permitAll()
            .requestMatchers("/index/**").permitAll()
            .requestMatchers("/login/**").permitAll()
            // admin kenakwa create kara ganimata
            .requestMatchers("/createAdmin").permitAll()
            .requestMatchers("/dashboard").hasAnyAuthority("Admin" , "Manager" , "Cashier")
            .requestMatchers("/employee/**").hasAnyAuthority("Admin" , "Manager")
            .requestMatchers("/privilege/**").hasAnyAuthority("Admin" , "Manager" , "Cashier")
            .requestMatchers("/user/**").hasAnyAuthority("Admin" , "Manager")
            .requestMatchers("/item/**").hasAnyAuthority("Admin" , "Manager" , "Cashier")
            .requestMatchers("/customer/**").hasAnyAuthority("Admin" , "Manager" , "Cashier")
            .anyRequest().authenticated();

            // /employee/** = employee walin pasu thawath services add wena bawa dekwimata(employee/findall)

            //access nethi ewata error page ekak genarate kala heka
            
         })
         // login details
         .formLogin(login -> {
            login
            .loginPage("/login") //login form eke action eka athi url eka 
            .defaultSuccessUrl("/dashboard" , true)
            .failureUrl("/login?error=usernamepassworderror") //parameter=error ,value=usernamepassworderror
            // login ekaka baliya yuthu condition tika MyUserServiceDetail file eka magin sidu karai

            // mehi parameters user entity walla athi properties walata equal wiya yuthuya
            //username , password login form eken labena nisa login html wala input field wala name attribute sadaha pahatha parameters 2ka add karai 
            .usernameParameter("username") //user name value eka ena parameter eka
            .passwordParameter("password");
            //form eken ena ihatha parameter walata adala value methanin access kra in pasu user service file ekata yai ema file eka auto bean ekan pass karai

         })
         //logout details
         .logout(logout -> {
            logout
            //logout lesa request kala wita logout eka weda karai 
            .logoutUrl("/logout")
            //logout eka succesfully nam login page ekata yai
            .logoutSuccessUrl("/login");

         })
         // exception handel
         .exceptionHandling(exp -> {
            exp.accessDeniedPage("/errorpage"); 
            // accessDenied = employee page ekata cashier acses kirimedi eyata ema page ekata privilege nethi nisa accessDeniedPage(errorpage html) eka eyata laba dei
            //e sadaha error page mapping ekak liya html ekak hediya yuthuya
         })
         //html page eka thula link kala js file wala request handel kirima
         //alldata,insert weni service access kala js file ekak(wenama 3rd party fill ekak) thulaya
         //html ekehi data load wimata awashya nisa ema request eka script thula sidu wiya
         //ema nisa url eka thula noyai ein pita fie ekak thula request handel karai
         //elesa request handel karanawanam aniwa basic ma security enable kara gatha yuthuya(csrf)
         .csrf(csrf -> {
            csrf.disable();
         });
         
         

         return http.build();
        }

    //password eka encrypt kirima sadaha   
    @Bean // memagin object ekak sede
    //memagin one way encript wimak siduwe.(encrypt karanna witharai puluwan decrypt karanna be)
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        //return karanawa constructur call karala instant ekak eya project eka thula onama thanaka use kala heka
        //constructer ekak pawathinna class ekak thiyenna ona 
        //class ekak nethuwa meya method ekak lesa use kara atha. bean magin mehi object eka sada dei
        return new BCryptPasswordEncoder();
    }

}
