package com.softlink.springboot.transport_task.service;

import com.softlink.springboot.transport_task.entity.Solution;
import com.softlink.springboot.transport_task.repository.SolutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskSolutionService {

    @Autowired
    private SolutionRepository solutionRepository;

    public List<Solution> getAll(){
        return solutionRepository.findAll();
    }

    public Optional<Solution> getById(int id){
        return solutionRepository.findById(id);
    }

    public Solution save(Solution solution){
        return solutionRepository.save(solution);
    }
}
