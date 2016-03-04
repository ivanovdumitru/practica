<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Entity\CompaniesRepository;
/**
 * @Template()
 * @package AppBundle\Controller
 */
class AdminController extends Controller
{
    /**
     * @Route("/admin", name="admin")
     */
  function indexAction(){
      return $this->render('AppBundle:AdminBlock:layout.html.twig');
  }
  /**
   * @Route("admin/viewmenu" , name="viewmenu")
   * @return Response
   */
  function viewmenuAction(){
    /* $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('AppBundle:Menu')->findAll();

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Review entity.');
        }
          else{
        $result = [
            'id'        => $entity->getidmenu(),
            'denmenu' => $entity->getDenMenu(),
            
          ];}*/
       $connect = $this->get('database_connection');
       $search1['result'] = $connect->fetchAll("select id_menu,den_menu  From menu");
        $result=[];
         foreach ($search1['result'] as $item){
             $result[] = [
                    'id_menu' => $item['id_menu'],
                    'den_menu' => $item['den_menu'],
             ];   
         }
     return new Response(json_encode($result), 200, array('Content-Type' => 'application/json'));
  
  }  
  
  /**
   * @Route("admin/companiview" , name="companiview")
   * @return Response
   */
  function companiviewAction(){
      $companiesRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Companies');
      $companies['result'] = $companiesRepository->findAll();
         foreach ($companies['result'] as $item){
             $result[] = [
                    'C' => $item->getC(),
                    'Nm'=> $item->getNm(),
                    'Email'=> $item->getEmail(),
                    'Address'=> $item->getAddress(),
             ];   
         }
     
     return new Response(json_encode($result), 200, array('Content-Type' => 'application/json'));
  
  }
 
 /**
   * @Route("admin/itemsview" , name="itemsview")
   * @return Response
   */
  function itemsviewAction(){
        $ItemsRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Items');
      $items['result'] = $ItemsRepository->findAll();
         foreach ($items['result'] as $item){
             $result[] = [
                    'Code' => $item->getCode(),
                    'Nm'=> $item->getNm(),
                    'Description'=> $item->getDescription(),
             ];   
         }
     return new Response(json_encode($result), 200, array('Content-Type' => 'application/json'));
  
  } 
  
  
  
/**
   * @Route("admin/articlesview" , name="articlesview")
   * @return Response
   */
  function articlesviewAction(){
       $connect = $this->get('database_connection');
       $search1['result'] = $connect->fetchAll("select *  From articles");
        $result=[];
         foreach ($search1['result'] as $item){
             $result[] = [
                    'id' => $item['id'],
                    'title' => $item['title'],
                    'description'=> $item['description'],
                    'created' => $item['created'] 
             ];   
         }
     return new Response(json_encode($result), 200, array('Content-Type' => 'application/json'));
  
  }   
  
  
} 